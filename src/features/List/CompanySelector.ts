import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { viewModeNoCountries, viewModeWithLinkedIn } from "./ListSlice";
import { CONTACT_COUNTRY_FIELD, LINKEDIN_ACCOUNT_FIELD } from "app/CONSTANTS";

export const companySelector = createSelector(
  ({ company, list: { viewMode } }: RootState) => ({
    companies: company.companies,
    viewMode,
  }),
  ({ companies, viewMode }) => {
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
      default:
        return companies;
    }
  }
);
