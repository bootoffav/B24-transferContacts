import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import {
  viewModeNoCountries,
  viewModeWithLinkedIn,
  viewModeContactsCountryNone,
  viewModeDiffs,
  viewModeCustom,
  ListSliceState,
} from "./listSlice";
import { CONTACT_COUNTRY_FIELD, LINKEDIN_ACCOUNT_FIELD } from "app/CONSTANTS";
import { companyHasDiffRespOfItsRelatedEntity } from "app/differentResponsibles";
import companiesByUser from "utils/companiesByUser";
import { Company, Country } from "types";

export const companySelector = createSelector(
  ({ company, common, list }: RootState) => ({
    companies: company.companies,
    companyCountryList: common.companyCountryList,
    contactCountryList: common.contactCountryList,
    list,
  }),
  ({ companies, list, contactCountryList }) => {
    switch (list.viewMode) {
      case viewModeNoCountries:
        return companyNoCountryView(companies);
      case viewModeWithLinkedIn:
        return companies.filter((company) => company[LINKEDIN_ACCOUNT_FIELD]);
      case viewModeContactsCountryNone:
        return contactsNoCountryView(companies, contactCountryList);
      case viewModeDiffs:
        return companies.filter(companyHasDiffRespOfItsRelatedEntity);
      case viewModeCustom:
        return customViewCompanies(companies, list.customViewUserId);
      default:
        return companies;
    }
  }
);

function companyNoCountryView(companies: Company[]) {
  return companies.filter(
    ({ CONTACTS }) =>
      !CONTACTS.map((contact) => (contact as any)[CONTACT_COUNTRY_FIELD]).every(
        (el) => el
      )
  );
}

function contactsNoCountryView(
  companies: Company[],
  contactCountryList: Country[]
) {
  return companies.filter((company) => {
    for (const contact of company.CONTACTS) {
      if (contact[CONTACT_COUNTRY_FIELD] === null) {
        return true;
      }
      const contactCountry = contactCountryList.find(
        ({ ID }) => ID === contact[CONTACT_COUNTRY_FIELD]
      )?.value;

      if (contactCountry === "none") {
        return true;
      }
    }

    return false;
  });
}

function customViewCompanies(
  companies: Company[],
  userId: ListSliceState["customViewUserId"]
) {
  return (userId ? companiesByUser(companies, userId) : companies).filter(
    companyHasDiffRespOfItsRelatedEntity
  );
}
