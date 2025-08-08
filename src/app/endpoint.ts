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
  EntitiesToFetch,
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
  COMPANY_1CCODE_FIELD,
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

  function withDefaults(result: Company[]) {
    return result.map((company) => ({
      ...company,
      EMAIL: company.EMAIL ?? [],
    }));
  }

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
  const select = [
    "*",
    "EMAIL",
    LINKEDIN_ACCOUNT_FIELD,
    COMPANY_COUNTRY_FIELD,
    COMPANY_1CCODE_FIELD,
  ];
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
      .then(({ result, next }) => [withDefaults(result), next]);

    companies = companies.concat(result);
    start = next;
  }

  return companies;
};

async function batchFetch(
  companiesId: Company["ID"][],
  entityToFetch: (EntitiesToFetch[number] | "contact")[],
  headEntity: "company" | "contact" = "company"
): Promise<any> {
  function formRequestBody() {
    return companiesId.reduce((acc, id) => {
      return Object.assign(
        acc,
        ...entityToFetch.map((entityType) => {
          return {
            [`${entityType}_${id}`]:
              `crm.${entityType}.list?` +
              stringify({
                filter: { [`${headEntity.toUpperCase()}_ID`]: id },
                select:
                  entityType === "contact"
                    ? [
                        "*",
                        CONTACT_POSITION_FIELD,
                        CONTACT_COUNTRY_FIELD,
                        "EMAIL",
                      ]
                    : ["*"],
              }),
          };
        })
      );
    }, {});
  }

  const {
    result: { result: rawResult },
  } = await fetch(`${endpoint}${userId}/${webhookToken}/batch`, {
    method: "POST",
    body: stringify({
      halt: 0,
      cmd: formRequestBody(),
    }),
  }).then((r) => r.json());
  const acc: {
    [key: string]: {
      CONTACTS: Contact[];
      LEADS: (Contact | Deal)[];
      DEALS: (Contact | Deal)[];
    };
  } = {};

  const result = Object.entries(rawResult).reduce((acc, [key, value]) => {
    const [type, companyId] = key.split("_");
    acc[companyId] = acc[companyId] ?? {
      CONTACTS: [],
      LEADS: [],
      DEALS: [],
    };
    // @ts-expect-error
    acc[companyId][`${type.toUpperCase()}S`] = value;
    return acc;
  }, acc);

  // rename EMAIL to EMAILS
  if (headEntity === "company") {
    for (const prop in result) {
      result[prop].CONTACTS = result[prop].CONTACTS.map(
        (contact: Contact & { EMAIL?: Contact["EMAILS"] }) => {
          delete Object.assign(contact, { EMAILS: contact.EMAIL || [] })[
            "EMAIL"
          ];
          return contact;
        }
      );
    }
  }

  return result;
}

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

async function changeField(
  entity: "contact" | "company",
  id: Contact["ID"] | Company["ID"],
  field: typeof CONTACT_POSITION_FIELD | typeof COMPANY_1CCODE_FIELD,
  value: string
) {
  return fetch(`${endpoint}${userId}/${webhookToken}/crm.${entity}.update`, {
    method: "POST",
    body: stringify({
      id,
      fields: {
        [field]: value,
      },
    }),
  });
}

async function changeCompanyCountry(
  companyId: Company["ID"],
  countryId: string
) {
  return fetch(`${endpoint}${userId}/${webhookToken}/crm.company.update`, {
    method: "POST",
    body: stringify({
      id: companyId,
      fields: {
        [COMPANY_COUNTRY_FIELD]: countryId,
      },
    }),
  });
}

async function* transferEntity(
  differentResponsibles: Transfer,
  transferType: RootState["transferButton"]["transferEntityType"]
) {
  // TO-DO: apply types
  const convertedTransferTypes =
    transferType === "all"
      ? ["CONTACTS", "LEADS", "DEALS"]
      : [transferType.toUpperCase()];

  for (const responsibleId in differentResponsibles) {
    for (const entityType of convertedTransferTypes) {
      // @ts-ignore
      for (const entityId of differentResponsibles[responsibleId][entityType]) {
        yield await fetch(
          `${endpoint}${userId}/${webhookToken}/crm.${entityType
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

async function* transferCountry(noCountry: TransferCountry) {
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
      yield;
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
      const {
        common: { departments, users },
      } = getState() as RootState;
      return Object.keys(departments).length === 0 && Boolean(users.length);
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
  changeField,
  changeCompanyCountry,
  updateContactEmails,
  transferCountry,
  batchFetch,
};
