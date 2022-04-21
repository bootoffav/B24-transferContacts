function getDifferentContactResponsibles(companies: any[]) {
  const toReturn: any = {};
  companies.forEach((company) => {
    company.CONTACTS.forEach((contact: any) => {
      if (company.ASSIGNED_BY_ID !== contact.ASSIGNED_BY_ID) {
        toReturn[company.ASSIGNED_BY_ID] = [
          ...(toReturn[company.ASSIGNED_BY_ID] || []),
          contact.ID,
        ];
      }
    });
  });

  return toReturn;
}

export default getDifferentContactResponsibles;
