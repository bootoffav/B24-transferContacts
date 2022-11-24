import { Company, Transfer } from "../types";
import { getOptionalEntitiesToFetch } from "./helpers";

function getDifferentContactResponsibles(companies: Company[]): Transfer {
  const acc: Transfer = {};
  companies.forEach((company) => {
    acc[company.ASSIGNED_BY_ID] ??= {
      CONTACTS: [],
      DEALS: [],
      LEADS: [],
    };

    const entities = [
      "CONTACTS",
      ...getOptionalEntitiesToFetch().map(
        (entity) => `${entity.toUpperCase()}S`
      ),
    ] as ("CONTACTS" | "DEALS" | "LEADS")[];
    entities.forEach((entitySet) => {
      company[entitySet].forEach((entity) => {
        if (company.ASSIGNED_BY_ID !== entity.ASSIGNED_BY_ID) {
          acc[company.ASSIGNED_BY_ID][entitySet].push(entity.ID);
        }
      });
    });
  });

  return acc;
}

export default getDifferentContactResponsibles;
