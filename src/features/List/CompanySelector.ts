import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { viewModeNoCountries, viewModeWithLinkedIn } from "./ListSlice";

const {
  REACT_APP_B24_CONTACT_COUNTRY_FIELD: contactCountryField = "",
  REACT_APP_B24_LINKEDIN_ACCOUNT_FIELD: linkedInAccountField = "",
} = process.env;

export const companySelector = createSelector(
  ({ company, list: { viewMode } }: RootState) => ({
    companies: company.companiesWithRelatedEntities,
    viewMode,
  }),
  ({ companies, viewMode }) => {
    switch (viewMode) {
      case viewModeNoCountries:
        return companies.filter(
          ({ CONTACTS }) =>
            !CONTACTS.map(
              (contact) => (contact as any)[contactCountryField]
            ).every((el) => el)
        );
      case viewModeWithLinkedIn:
        return companies.filter(
          (company) =>
            // @ts-ignore
            company[linkedInAccountField]
        );
      default:
        return companies;
    }
  }
);
