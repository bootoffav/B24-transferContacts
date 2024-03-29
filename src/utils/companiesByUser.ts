import type { Company } from "../types";

export default function companiesByUser(companies: Company[], id: number) {
  return companies.filter(({ ASSIGNED_BY_ID }) => +ASSIGNED_BY_ID === id);
}
