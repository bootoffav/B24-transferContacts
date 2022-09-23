import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

const contactCountryField =
  process.env.REACT_APP_B24_CONTACT_COUNTRY_FIELD ?? "";

export const noCountrySelector = createSelector(
  ({ company }: RootState) => company.companies,
  (companiesWithRelatedEntities) =>
    companiesWithRelatedEntities.filter(
      ({ CONTACTS }) =>
        !CONTACTS.map((contact) => (contact as any)[contactCountryField]).every(
          (el) => el
        )
    )
);
