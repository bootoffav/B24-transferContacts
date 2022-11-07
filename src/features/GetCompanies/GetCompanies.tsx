import { unionBy } from "lodash";
import { batchFetch, fetchCompanies, fetchRelatedEntities } from "app/endpoint";
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
import { Company } from "../../types";
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
      for await (const company of getCompaniesWithRelatedEntities(
        rawCompanies
      )) {
        companies = [...companies, company];
        dispatch(setProcessedAmount(1));
        if (companies.length % 20 === 0) {
          pushChangesToStore(companies);
          await (() => new Promise((r) => setTimeout(r, 5000)))();
        }
      }
      pushChangesToStore(companies);
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
): AsyncGenerator<Company> {
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

    for (const company of companiesWithContactsLeadsDeals) {
      let allContactDeals: any[] = [];
      let allContactLeads: any[] = [];
      const IDs = company.CONTACTS.map(({ ID }) => ID);
      const batchResult = await batchFetch(IDs, ["deal", "lead"], "contact");
      Object.entries(batchResult).forEach(function ([
        _,
        { DEALS, LEADS },
      ]: any) {
        allContactDeals = [...allContactDeals, ...DEALS];
        allContactLeads = [...allContactLeads, ...LEADS];
      });
      // exclude second copy of Leads & Deals that belong to Company and Contacts simultaniously
      const uniqueLeads = unionBy(
        [...company.LEADS, ...allContactLeads],
        ({ ID }) => ID
      );
      const uniqueDeals = unionBy(
        [...company.DEALS, ...allContactDeals],
        ({ ID }) => ID
      );
      yield {
        ...company,
        DEALS: uniqueDeals,
        LEADS: uniqueLeads,
      };
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
