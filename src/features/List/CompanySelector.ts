import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import {
  viewModeNoCountries,
  viewModeWithLinkedIn,
  viewModeCompanyContactsDiffCountries,
} from "./ListSlice";
import {
  COMPANY_COUNTRY_FIELD,
  CONTACT_COUNTRY_FIELD,
  LINKEDIN_ACCOUNT_FIELD,
} from "app/CONSTANTS";

export const companySelector = createSelector(
  ({ company, common, list: { viewMode } }: RootState) => ({
    companies: company.companies,
    companyCountryList: common.companyCountryList,
    contactCountryList: common.contactCountryList,
    viewMode,
  }),
  ({ companies, viewMode, companyCountryList, contactCountryList }) => {
    switch (viewMode) {
      case viewModeNoCountries:
        return companies.filter(
          ({ CONTACTS }) =>
            !CONTACTS.map(
              (contact) => (contact as any)[CONTACT_COUNTRY_FIELD]
            ).every((el) => el)
        );
      case viewModeWithLinkedIn:
        return companies.filter((company) => company[LINKEDIN_ACCOUNT_FIELD]);
      case viewModeCompanyContactsDiffCountries:
        return companies.filter((company) => {
          const companyCountry = companyCountryList.find(
            ({ ID }) => ID === company[COMPANY_COUNTRY_FIELD]
          )?.value;
          for (const contact of company.CONTACTS) {
            const contactCountry = contactCountryList.find(
              ({ ID }) => ID === contact[CONTACT_COUNTRY_FIELD]
            )?.value;

            if (contactCountry !== companyCountry) {
              return true;
            }
          }
          return false;
        });
      default:
        return companies;
    }
  }
);
