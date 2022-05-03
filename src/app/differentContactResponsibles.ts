import { Company, Transfer } from "../types";

function getDifferentContactResponsibles(companies: Company[]): Transfer {
  const acc: Transfer = {};
  companies.forEach((company) => {
    company.CONTACTS.forEach((contact) => {
      if (company.ASSIGNED_BY_ID !== contact.ASSIGNED_BY_ID) {
        acc[company.ASSIGNED_BY_ID] = [
          ...(acc[company.ASSIGNED_BY_ID] || []),
          contact.ID,
        ];
      }
    });
  });

  return acc;
}

export default getDifferentContactResponsibles;
