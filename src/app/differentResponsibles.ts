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

export default getDifferentResponsibles;
