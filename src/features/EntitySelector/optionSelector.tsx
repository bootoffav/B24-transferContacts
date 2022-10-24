import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";

export const optionSelector = createSelector(
  ({
    common: { selectType, users, companyCountryList, departments },
  }: RootState) => ({
    selectType,
    users,
    companyCountryList,
    departments,
  }),
  ({ selectType, users, companyCountryList, departments }) => {
    switch (selectType) {
      case "companyCountryList":
        return companyCountryList.map(({ value, ID }) => (
          <option key={ID} value={ID}>
            {value}
          </option>
        ));
      case "departments":
        return Object.entries(departments).map(([name, [depId, usersId]]) => (
          <option key={depId} value={usersId.toString()}>
            {name}
          </option>
        ));
      default:
        return users.map(({ NAME, LAST_NAME, ID, ACTIVE }) => (
          <option key={ID} value={ID}>
            {`${NAME} ${LAST_NAME} ${ACTIVE ? "" : " - dismissed"}`}
          </option>
        ));
    }
  }
);
