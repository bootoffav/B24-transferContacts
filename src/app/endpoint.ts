import { stringify } from "qs";

const {
  REACT_APP_B24_ENDPOINT: endpoint,
  REACT_APP_B24_USER_ID: userId,
  REACT_APP_B24_WEBHOOK_TOKEN: webhookToken,
  REACT_APP_B24_COUNTRY_FIELD_ID: countryFieldId,
  REACT_APP_B24_COUNTRY_FIELD: countryField,
} = process.env;

const fetchCountryList = async function () {
  return await fetch(
    `${endpoint}${userId}/${webhookToken}/crm.company.userfield.get?` +
      stringify({ ID: countryFieldId })
  )
    .then((r) => r.json())
    .then((response) => {
      if ("error" in response && "error_description" in response) {
        throw new Error();
      }
      const {
        result: { LIST: countries },
      } = response;
      return countries.map((country: any) => ({
        value: country.VALUE,
        id: country.ID,
      }));
    });
};

const fetchCompanies = async (countryId: string): Promise<any[]> => {
  if (!countryField) throw new Error("country field ID not specified");

  let companies: any[] = [];
  let start = 0;
  while (start !== undefined) {
    const [result, next] = await fetch(
      `${endpoint}${userId}/${webhookToken}/crm.company.list`,
      {
        method: "POST",
        body: stringify({
          filter: { [countryField as string]: countryId },
          start,
        }),
      }
    )
      .then((r) => r.json())
      .then(({ result, next }) => [result, next]);

    companies = companies.concat(result);
    start = next;
  }

  return companies;
};

const fetchCompanyContacts = async (companyId: string) => {
  return await fetch(`${endpoint}${userId}/${webhookToken}/crm.contact.list`, {
    method: "POST",
    body: stringify({
      filter: { COMPANY_ID: companyId },
    }),
  })
    .then((r) => r.json())
    .then((r) => r.result);
};

const getUsers = async () => {
  let users: any[] = [];
  let start = 0;
  while (start !== undefined) {
    const [result, next] = await fetch(
      `${endpoint}${userId}/${webhookToken}/user.get`,
      {
        method: "POST",
        body: stringify({
          start,
        }),
      }
    )
      .then((r) => r.json())
      .then(({ result, next }) => [result, next]);
    users = users.concat(result);
    start = next;
  }

  return users;
};

export { fetchCountryList, fetchCompanies, fetchCompanyContacts, getUsers };
