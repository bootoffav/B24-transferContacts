import { Company, Transfer } from "../types";

function getDifferentContactResponsibles(companies: Company[]): Transfer {
  const acc: Transfer = {};
  companies.forEach((company) => {
    acc[company.ASSIGNED_BY_ID] ??= {
      CONTACTS: [],
      DEALS: [],
      LEADS: [],
    };

    (["CONTACTS", "DEALS", "LEADS"] as const).forEach((entitySet) => {
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
