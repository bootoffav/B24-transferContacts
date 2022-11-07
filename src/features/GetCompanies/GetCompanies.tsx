import { unionBy } from "lodash";
import { batchFetch, fetchCompanies } from "app/endpoint";
import {
  setCompanies,
  setDifferentResponsibles,
  setTotalAmount,
  setProcessedAmount,
  setContactsNoCountries,
} from "app/companySlice";
import getDifferentResponsibles from "app/differentResponsibles";
import getContactsNoCountries from "app/contactsNoCountries";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setStage, Stage } from "app/commonSlice";
import { Company, Contact } from "../../types";
import ControlButton from "./ControlButton";
import { store } from "../../app/store";
import { setPageIndex } from "features/List/listSlice";

export default function GetCompanies() {
  const dispatch = useAppDispatch();
  const chosenId = useAppSelector(({ common }) => common.chosenId);
  const selectType = useAppSelector(({ common }) => common.selectType);
  const linkedInOnly = useAppSelector(({ common }) => common.linkedInOnly);

  const clickHandler = async () => {
    if (!chosenId.length) {
      return alert(`choose entity first`);
    }
    // set up initial state
    dispatch(setCompanies([]));
    dispatch(setProcessedAmount(0));
    dispatch(setTotalAmount(0));
    dispatch(setStage(Stage.gettingData));
    dispatch(setPageIndex(0));

    try {
      // get companies
      const rawCompanies: Company[] = [];
      for (const id of chosenId) {
        const companiesOfSpecificUser = await fetchCompanies(id, selectType);
        rawCompanies.push(...companiesOfSpecificUser);
      }

      if (linkedInOnly) {
        dispatch(setCompanies(rawCompanies));
        dispatch(setStage(Stage.linkedInOnlyScanFinished));
        return;
      }
      dispatch(setTotalAmount(rawCompanies.length));

      //working on company related entities
      let companies: Company[] = [];
      for await (const chunkOfReadyCompanies of getCompaniesWithRelatedEntities(
        rawCompanies
      )) {
        companies = [...companies, ...chunkOfReadyCompanies];
        dispatch(setProcessedAmount(chunkOfReadyCompanies.length));
        pushChangesToStore(companies);
      }
      dispatch(setStage(Stage.scanFinished));
    } catch (error) {
      dispatch(setStage(Stage.stuck));
    }
  };

  return <ControlButton clickHandler={clickHandler} />;
}

function* getChunkOfCompanies(companies: Company[], chunkSize = 15) {
  for (let i = 0; i < companies.length; i += chunkSize) {
    yield companies.slice(i, i + chunkSize);
  }
}

async function* getCompaniesWithRelatedEntities(
  companies: Company[]
): AsyncGenerator<Company[]> {
  for (const chunkOfCompanies of getChunkOfCompanies(companies)) {
    // step to add DEALS that belong to contact, add them to company instead.
    const chunkOfCompaniesId = chunkOfCompanies.map(({ ID }) => ID);

    const companiesContactsLeadsDeals: Company[] = await batchFetch(
      chunkOfCompaniesId,
      ["contact", "deal", "lead"]
    );

    const companiesWithContactsLeadsDeals = chunkOfCompanies.map((company) => ({
      ...company,
      ...companiesContactsLeadsDeals[company.ID],
    }));

    for (const chunkOfCompanies of getChunkOfCompanies(
      companiesWithContactsLeadsDeals
    )) {
      const companyContactsMap = new Map<Company["ID"], Contact["ID"][]>();

      const contactsIDs: Contact["ID"][] = [];
      chunkOfCompanies.forEach(({ ID, CONTACTS }) => {
        const contactIds = CONTACTS.map(({ ID }) => ID);
        contactsIDs.push(...contactIds);
        companyContactsMap.set(ID, contactIds);
      });
      const batchResult = await batchFetch(
        contactsIDs,
        ["deal", "lead"],
        "contact"
      );
      Object.entries(batchResult).forEach(function ([
        contactId,
        { DEALS, LEADS },
      ]: any) {
        // find company to which contact applies
        let companyId: number;
        for (const [
          curCompanyId,
          contactsIds,
        ] of companyContactsMap.entries()) {
          if (contactsIds.includes(contactId)) {
            companyId = curCompanyId;
            break;
          }
        }
        // prone to error
        const idx = companiesWithContactsLeadsDeals.findIndex(
          ({ ID }) => ID === companyId
        );
        companiesWithContactsLeadsDeals[idx].DEALS = unionBy(
          [...companiesWithContactsLeadsDeals[idx].DEALS, ...DEALS],
          ({ ID }) => ID
        );
        companiesWithContactsLeadsDeals[idx].LEADS = unionBy(
          [...companiesWithContactsLeadsDeals[idx].LEADS, ...LEADS],
          ({ ID }) => ID
        );
      });

      yield companiesWithContactsLeadsDeals;
      if (store.getState().common.stage === Stage.cancelling) break;
    }
  }
}

function pushChangesToStore(companies: Company[]) {
  // sort companies alphabetically, case insensitive
  companies.sort(({ TITLE: A }, { TITLE: B }) => {
    A = A.toLowerCase();
    B = B.toLowerCase();
    return A > B ? 1 : A < B ? -1 : 0;
  });
  store.dispatch(setCompanies(companies));
  const differentResponsibles = getDifferentResponsibles(companies);
  store.dispatch(setDifferentResponsibles(differentResponsibles));

  const contactsNoCountry = getContactsNoCountries();
  store.dispatch(setContactsNoCountries(contactsNoCountry));
}
