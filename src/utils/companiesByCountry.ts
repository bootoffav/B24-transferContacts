import type { Company } from "../types";
import { COMPANY_COUNTRY_FIELD } from "app/CONSTANTS";

export default function companiesByCountry(companies: Company[], id: number) {
  return companies.filter((company) => +company[COMPANY_COUNTRY_FIELD] === id);
}
