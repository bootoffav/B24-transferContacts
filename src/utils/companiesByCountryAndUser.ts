import type { Company } from "types";
import { COMPANY_COUNTRY_FIELD } from "app/CONSTANTS";
import { store } from "app/store";

export function companiesByCountryAndUser(companies: Company[], id: number) {
  const { chosenId: countryId } = store.getState().common;
  return companies.filter(
    (c) =>
      +c.ASSIGNED_BY_ID === id && +c[COMPANY_COUNTRY_FIELD] === countryId[0]
  );
}
