import { stringify } from "qs";
import {
  Company,
  Contact,
  Deal,
  Country,
  Transfer,
  User,
  EntityType,
} from "../types";
import { CommonState } from "./commonSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";

const {
  REACT_APP_B24_ENDPOINT: endpoint,
  REACT_APP_B24_USER_ID: userId,
  REACT_APP_B24_WEBHOOK_TOKEN: webhookToken,
  REACT_APP_B24_COUNTRY_FIELD_ID: countryFieldId,
  REACT_APP_B24_COUNTRY_FIELD: countryField,
  REACT_APP_B24_CONTACT_POSITION_FIELD: contactPositionField,
} = process.env;

const fetchCompanies = async (
  chosenId: number,
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

const fetchRelatedEntities = async (
  entityId: number,
  entityType: EntityType,
  headEntity: "company" | "contact" = "company"
): Promise<Contact[] | Deal[]> => {
  const select = entityType === "contact" ? ["*", contactPositionField] : ["*"];

  return await fetch(
    `${endpoint}${userId}/${webhookToken}/crm.${entityType}.list`,
    {
      method: "POST",
      body: stringify({
        filter: { [`${headEntity.toUpperCase()}_ID`]: entityId },
        select,
      }),
    }
  )
    .then((r) => r.json())
    .then((r) => r.result);
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

async function* transferEntity(differentResponsibles: Transfer) {
  for (let responsibleId in differentResponsibles) {
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

const fetchCountries = createAsyncThunk(
  "common/fetchCountries",
  async (): Promise<Country[]> =>
    await fetch(
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
          ID: country.ID,
        }));
      }),
  {
    condition: (_, { getState }) =>
      Boolean((getState() as RootState).common.countries.length === 0),
  }
);

export {
  fetchCompanies,
  fetchRelatedEntities,
  fetchUsers,
  transferEntity,
  fetchCountries,
};
