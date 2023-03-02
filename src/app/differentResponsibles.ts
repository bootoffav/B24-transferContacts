import { Company, Transfer } from "../types";
import { getOptionalEntitiesToFetch } from "./helpers";

function getDifferentResponsibles(companies: Company[]): Transfer {
  const acc: Transfer = {};
  companies.forEach((company) => {
    const entityTypes = [
      "CONTACTS",
      ...getOptionalEntitiesToFetch().map(
        (entity) => `${entity.toUpperCase()}S`
      ),
    ] as ("CONTACTS" | "DEALS" | "LEADS")[];

    entityTypes.forEach((entityType) => {
      company[entityType].forEach((entity) => {
        if (company.ASSIGNED_BY_ID !== entity.ASSIGNED_BY_ID) {
          acc[company.ASSIGNED_BY_ID] ??= {
            CONTACTS: [],
            DEALS: [],
            LEADS: [],
          };
          acc[company.ASSIGNED_BY_ID][entityType].push(entity.ID);
        }
      });
    });
  });

  return acc;
}

export function companyHasDiffRespOfItsRelatedEntity(
  company: Company
): boolean {
  for (const entityType of ["CONTACTS", "LEADS", "DEALS"] as const) {
    for (const entitityOFAType of company[entityType]) {
      if (company.ASSIGNED_BY_ID !== entitityOFAType.ASSIGNED_BY_ID)
        return true;
    }
  }

  return false;
}

export default getDifferentResponsibles;
