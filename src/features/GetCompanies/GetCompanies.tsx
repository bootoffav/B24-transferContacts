import { unionBy } from "lodash";
import { fetchCompanies, fetchRelatedEntities } from "app/endpoint";
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
import type { SyntheticEvent } from "react";
import { Contact, Company } from "../../types";
import ControlButton from "./ControlButton";

export default function GetCompanies() {
  const dispatch = useAppDispatch();
  const chosenId = useAppSelector(({ common }) => common.chosenId);
  const selectType = useAppSelector(({ common }) => common.selectType);
  const linkedInOnly = useAppSelector(({ common }) => common.linkedInOnly);
  const contactCountryLIst = useAppSelector(
    ({ common }) => common.contactCountryList
  );
  const companyCountryLIst = useAppSelector(
    ({ common }) => common.companyCountryList
  );

  const clickHandler = async ({ target }: SyntheticEvent) => {
    if (chosenId) {
      if ((target as HTMLButtonElement).innerHTML === "STOP") {
        window.aborted = true;
        dispatch(setStage(Stage.cancelling));
        return;
      }
      // set up initial state
      dispatch(setProcessedAmount(0));
      dispatch(setTotalAmount(0));
      dispatch(setStage(Stage.gettingData));

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
      }

      // sort companies alphabetically, case insensitive
      companies.sort(({ TITLE: A }, { TITLE: B }) => {
        A = A.toLowerCase();
        B = B.toLowerCase();
        return A > B ? 1 : A < B ? -1 : 0;
      });

      dispatch(setCompanies(companies));
      dispatch(setStage(Stage.scanFinished));
      const differentResponsibles = getDifferentResponsibles(companies);
      dispatch(setDifferentResponsibles(differentResponsibles));

      const contactsNoCountry = getContactsNoCountries(
        companies,
        companyCountryLIst,
        contactCountryLIst
      );
      dispatch(setContactsNoCountries(contactsNoCountry));
      return;
    }
    alert(`choose ${selectType} first`);
  };

  return <ControlButton clickHandler={clickHandler} />;
}

async function* getCompaniesWithRelatedEntities(
  companies: Company[]
): AsyncGenerator<Company> {
  for (let company of companies) {
    if (window.aborted) {
      window.aborted = false;
      return;
    }
    await (() => new Promise((r) => setTimeout(r, 700)))();

    // step to add DEALS that belong to contact, add them to company instead.
    const contacts = await fetchRelatedEntities(company.ID, "contact");
    await (() => new Promise((r) => setTimeout(r, 350)))();
    const companyDeals = await fetchRelatedEntities(company.ID, "deal");
    await (() => new Promise((r) => setTimeout(r, 350)))();
    const companyLeads = await fetchRelatedEntities(company.ID, "lead");

    let allContactDeals: any[] = [];
    let allContactLeads: any[] = [];
    for (const contact of contacts) {
      allContactDeals = [
        ...allContactDeals,
        ...(await fetchRelatedEntities(contact.ID, "deal", "contact")),
      ];
      allContactLeads = [
        ...allContactLeads,
        ...(await fetchRelatedEntities(contact.ID, "lead", "contact")),
      ];
    }
    // exclude second copy of Leads & Deals that belong to Company and Contacts simultaniously
    const uniqueLeads = unionBy(
      [...companyLeads, ...allContactLeads],
      ({ ID }) => ID
    );
    const uniqueDeals = unionBy(
      [...companyDeals, ...allContactDeals],
      ({ ID }) => ID
    );

    yield {
      ...company,
      CONTACTS: contacts as Contact[],
      DEALS: uniqueDeals,
      LEADS: uniqueLeads,
    };
  }
}
