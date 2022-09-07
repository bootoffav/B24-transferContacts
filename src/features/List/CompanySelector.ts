import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

const contactCountryField =
  process.env.REACT_APP_B24_CONTACT_COUNTRY_FIELD ?? "";

export const companySelector = createSelector(
  ({ company, list: { viewMode } }: RootState) => ({
    companies: company.companiesWithRelatedEntities,
    viewMode,
  }),
  ({ companies, viewMode }) =>
    viewMode === "noCountries"
      ? companies.filter(
          ({ CONTACTS }) =>
            !CONTACTS.map(
              (contact) => (contact as any)[contactCountryField]
            ).every((el) => el)
        )
      : companies
);
