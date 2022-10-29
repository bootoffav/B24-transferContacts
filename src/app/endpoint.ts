import { stringify } from "qs";
import {
  Company,
  Contact,
  Deal,
  Country,
  Transfer,
  User,
  EntityType,
  TransferCountry,
  Departments,
} from "../types";
import { CommonState } from "./commonSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
  COMPANY_COUNTRY_FIELD,
  COMPANY_COUNTRY_FIELD_ID,
  CONTACT_COUNTRY_FIELD_ID,
  CONTACT_COUNTRY_FIELD,
  LINKEDIN_ACCOUNT_FIELD,
  CONTACT_POSITION_FIELD,
} from "./CONSTANTS";

const {
  REACT_APP_B24_ENDPOINT: endpoint,
  REACT_APP_B24_USER_ID: userId,
  REACT_APP_B24_WEBHOOK_TOKEN: webhookToken,
} = process.env;

const fetchCompanies = async (
  chosenId: number,
  selectType: CommonState["selectType"]
): Promise<Company[]> => {
  if (!chosenId) throw new Error("ID not specified");

  let filter;
  switch (selectType) {
    case "companyCountryList":
      filter = { [COMPANY_COUNTRY_FIELD]: chosenId };
      break;
    case "users":
    case "departments":
      filter = { ASSIGNED_BY_ID: chosenId };
      break;
  }

  let companies: Company[] = [];
  let start = 0;
  const select = ["*", LINKEDIN_ACCOUNT_FIELD, COMPANY_COUNTRY_FIELD];
  while (start !== undefined) {
    const [result, next] = await fetch(
      `${endpoint}${userId}/${webhookToken}/crm.company.list`,
      {
        method: "POST",
        body: stringify({
          select,
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

const fetchRelatedEntities = async (
  entityId: number,
  entityType: Extract<EntityType, "contact" | "deal" | "lead">,
  headEntity: "company" | "contact" = "company"
): Promise<Contact[] | Deal[]> => {
  const select =
    entityType === "contact"
      ? ["*", CONTACT_POSITION_FIELD, CONTACT_COUNTRY_FIELD, "EMAIL"]
      : ["*"];

  return fetch(`${endpoint}${userId}/${webhookToken}/crm.${entityType}.list`, {
    method: "POST",
    body: stringify({
      filter: { [`${headEntity.toUpperCase()}_ID`]: entityId },
      select,
    }),
  })
    .then((r) => r.json())
    .then(({ result }) =>
      entityType === "contact"
        ? result.map((contact: Contact & { EMAIL?: Contact["EMAILS"] }) => {
            delete Object.assign(contact, { EMAILS: contact.EMAIL || [] })[
              "EMAIL"
            ];
            return contact;
          })
        : result
    );
};

const fetchUsers = createAsyncThunk(
  "common/fetchUsers",
  async (): Promise<User[]> => {
    let users: User[] = [];
    let start = 0;
    while (start !== undefined) {
      const { result: usersChunk, next } = await fetch(
        `${endpoint}${userId}/${webhookToken}/user.get`,
        {
          method: "POST",
          body: stringify({
            start,
          }),
        }
      ).then((r): Promise<{ result: User[]; next: number }> => r.json());
      users = users.concat(usersChunk);
      start = next;
    }

    return users;
  },
  {
    condition: (_, { getState }) =>
      Boolean((getState() as RootState).common.users.length === 0),
  }
);

async function changePosition(id: Contact["ID"], position = "test") {
  return fetch(`${endpoint}${userId}/${webhookToken}/crm.contact.update`, {
    method: "POST",
    body: stringify({
      id,
      fields: {
        [CONTACT_POSITION_FIELD]: position,
      },
    }),
  });
}

async function* transferEntity(differentResponsibles: Transfer) {
  for (const responsibleId in differentResponsibles) {
    for (const entitySet of ["CONTACTS", "LEADS", "DEALS"] as const) {
      for (const entityId of differentResponsibles[responsibleId][entitySet]) {
        yield await fetch(
          `${endpoint}${userId}/${webhookToken}/crm.${entitySet
            .toLowerCase()
            .slice(0, -1)}.update`,
          {
            method: "POST",
            body: stringify({
              id: entityId,
              fields: {
                ASSIGNED_BY_ID: responsibleId,
              },
              params: { REGISTER_SONET_EVENT: "Y" },
            }),
          }
        )
          .then((r) => r.json())
          .catch(console.log);
      }
    }
  }
}

async function transferCountry(noCountry: TransferCountry) {
  for (const countryId in noCountry) {
    for (const contactId of noCountry[countryId]) {
      await fetch(`${endpoint}${userId}/${webhookToken}/crm.contact.update`, {
        method: "POST",
        body: stringify({
          id: contactId,
          fields: {
            [CONTACT_COUNTRY_FIELD]: countryId,
          },
          params: { REGISTER_SONET_EVENT: "Y" },
        }),
      })
        .then((r) => r.json())
        .catch(console.log);
    }
  }
}

const fetchDepartments = createAsyncThunk(
  "common/fetchDepartments",
  async (_, { getState }): Promise<Departments> => {
    function findUsersInDepartment(dep: number): Departments[number][1] {
      return users
        .filter((user) => user.ACTIVE && user.UF_DEPARTMENT.includes(dep))
        .map((user) => +user.ID);
    }

    const { users } = (getState() as RootState).common;
    const departments: Departments = {};
    await fetch(`${endpoint}${userId}/${webhookToken}/department.get`)
      .then((r) => r.json())
      .then(async ({ result }): Promise<any> => {
        for (const dep of result) {
          const id = +dep.ID;
          departments[dep.NAME] = [id, findUsersInDepartment(id)];
        }
      })
      .catch(console.log);
    return departments;
  },
  {
    condition: (_, { getState }) => {
      const store = getState() as RootState;
      return Boolean(
        Object.keys(store.common.departments).length === 0 &&
          store.common.users.length
      );
    },
  }
);

const fetchCountries = createAsyncThunk(
  "common/fetchCountries",
  async (): Promise<[Country[], Country[]]> => {
    function callback(response: any) {
      if ("error" in response && "error_description" in response) {
        throw new Error();
      }
      const {
        result: { LIST: countries },
      } = response;
      return countries.map((country: { VALUE: string; ID: string }) => ({
        value: country.VALUE,
        ID: country.ID,
      }));
    }

    return await Promise.all([
      fetch(
        `${endpoint}${userId}/${webhookToken}/crm.company.userfield.get?` +
          stringify({ ID: COMPANY_COUNTRY_FIELD_ID })
      )
        .then((r) => r.json())
        .then(callback),
      fetch(
        `${endpoint}${userId}/${webhookToken}/crm.contact.userfield.get?` +
          stringify({ ID: CONTACT_COUNTRY_FIELD_ID })
      )
        .then((r) => r.json())
        .then(callback),
    ]);
  },
  {
    condition: (_, { getState }) =>
      Boolean((getState() as RootState).common.companyCountryList.length === 0),
  }
);

async function fetchContactEmails(
  contactId: number
): Promise<Contact["EMAILS"]> {
  return fetch(`${endpoint}${userId}/${webhookToken}/crm.contact.list?`, {
    method: "POST",
    body: stringify({
      filter: { ID: contactId },
      select: ["EMAIL"],
    }),
  })
    .then((r) => r.json())
    .then(({ result }) => {
      const { EMAIL = [] } = result[0];
      return EMAIL as Contact["EMAILS"];
    });
}

async function updateContactEmails(
  contactId: Contact["ID"],
  emails: Contact["EMAILS"]
) {
  return await fetch(
    `${endpoint}${userId}/${webhookToken}/crm.contact.update?`,
    {
      method: "POST",
      body: stringify({
        id: contactId,
        fields: { EMAIL: emails },
      }),
    }
  )
    .then((r) => r.json())
    .then(({ result }) => result);
}

export {
  fetchCompanies,
  fetchRelatedEntities,
  fetchContactEmails,
  fetchUsers,
  fetchDepartments,
  transferEntity,
  fetchCountries,
  changePosition,
  updateContactEmails,
  transferCountry,
};
