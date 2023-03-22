import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

const companySelectorNoEmail = createSelector(
  ({ company }: RootState) => company.companies,
  (companies) => {
    return companies.filter(({ HAS_EMAIL }) => HAS_EMAIL === "N").length;
  }
);

export default companySelectorNoEmail;
