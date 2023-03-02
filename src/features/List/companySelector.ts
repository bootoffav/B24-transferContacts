import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import {
  viewModeNoCountries,
  viewModeWithLinkedIn,
  viewModeContactsCountryNone,
  viewModeDiffs,
} from "./listSlice";
import { CONTACT_COUNTRY_FIELD, LINKEDIN_ACCOUNT_FIELD } from "app/CONSTANTS";
import { companyHasDiffRespOfItsRelatedEntity } from "app/differentResponsibles";

export const companySelector = createSelector(
  ({ company, common, list: { viewMode } }: RootState) => ({
    companies: company.companies,
    companyCountryList: common.companyCountryList,
    contactCountryList: common.contactCountryList,
    viewMode,
  }),
  ({ companies, viewMode, contactCountryList }) => {
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
      case viewModeContactsCountryNone:
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
      case viewModeDiffs:
        return companies.filter(companyHasDiffRespOfItsRelatedEntity);
      default:
        return companies;
    }
  }
);
