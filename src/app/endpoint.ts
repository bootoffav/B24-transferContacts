import { stringify } from "qs";
import { Company, Contact, Country, Transfer, User } from "../types";
import { CommonState } from "./commonSlice";

const {
  REACT_APP_B24_ENDPOINT: endpoint,
  REACT_APP_B24_USER_ID: userId,
  REACT_APP_B24_WEBHOOK_TOKEN: webhookToken,
  REACT_APP_B24_COUNTRY_FIELD_ID: countryFieldId,
  REACT_APP_B24_COUNTRY_FIELD: countryField,
} = process.env;

const fetchCountryList = async function (): Promise<Country[]> {
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
      return countries.map((country: { VALUE: string; ID: string }) => ({
        value: country.VALUE,
        id: country.ID,
      }));
    });
};

const fetchCompanies = async (
  chosenId: string,
  selectType: CommonState["selectType"]
): Promise<Company[]> => {
  if (!chosenId) throw new Error("ID not specified");

  let filter;
  switch (selectType) {
    case "countries":
      filter = { [countryField as string]: chosenId };
      break;
    case "users":
      filter = { ASSIGNED_BY_ID: chosenId };
      break;
  }

  let companies: Company[] = [];
  let start = 0;
  while (start !== undefined) {
    const [result, next] = await fetch(
      `${endpoint}${userId}/${webhookToken}/crm.company.list`,
      {
        method: "POST",
        body: stringify({
          filter,
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

const fetchCompanyContacts = async (companyId: number): Promise<Contact[]> => {
  return await fetch(`${endpoint}${userId}/${webhookToken}/crm.contact.list`, {
    method: "POST",
    body: stringify({
      filter: { COMPANY_ID: companyId },
    }),
  })
    .then((r) => r.json())
    .then((r) => r.result);
};

const fetchUsers = async (): Promise<User[]> => {
  let users: User[] = [];
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

const transferContacts = async (differentResponsibles: Transfer) => {
  for (let responsibleId in differentResponsibles) {
    for (let contactId of differentResponsibles[responsibleId]) {
      await fetch(`${endpoint}${userId}/${webhookToken}/crm.contact.update`, {
        method: "POST",
        body: stringify({
          id: contactId,
          fields: {
            ASSIGNED_BY_ID: responsibleId,
          },
          params: { REGISTER_SONET_EVENT: "Y" },
        }),
      })
        .then((r) => r.json())
        .catch(console.log);
    }
  }
};

export {
  fetchCountryList,
  fetchCompanies,
  fetchCompanyContacts,
  fetchUsers,
  transferContacts,
};
