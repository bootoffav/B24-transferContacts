import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const optionSelector = createSelector(
  ({ common: { selectType, users, companyCountryList } }: RootState) => ({
    selectType,
    users,
    companyCountryList,
  }),
  ({ selectType, users, companyCountryList }) =>
    selectType === "companyCountryList"
      ? companyCountryList.map(({ value, ID }) => (
          <option key={ID} value={ID}>
            {value}
          </option>
        ))
      : users.map(({ NAME, LAST_NAME, ID, ACTIVE }) => (
          <option key={ID} value={ID}>
            {`${NAME} ${LAST_NAME} ${ACTIVE ? "" : " - dismissed"}`}
          </option>
        ))
);
