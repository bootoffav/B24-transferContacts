import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company, Contact, Transfer, TransferCountry } from "../types";
import { COMPANY_1CCODE_FIELD, CONTACT_POSITION_FIELD } from "./CONSTANTS";

export interface CompanyState {
  totalAmount: number;
  processedAmount: number;
  companies: Company[];
  differentResponsibles: Transfer;
  contactsNoCountries: TransferCountry;
  listOfCompaniesWithNoCountryInContact: Company["ID"][];
}

const initialState: CompanyState = {
  totalAmount: 0,
  processedAmount: 0,
  companies: [],
  differentResponsibles: [],
  contactsNoCountries: [],
  listOfCompaniesWithNoCountryInContact: [],
};

export const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanies: (state, { payload }) => {
      state.companies = payload;
    },

    changeField: (
      state,
      {
        payload: { id, value, entity },
      }: PayloadAction<{
        id: Contact["ID"] | Company["ID"];
        value:
          | Contact[typeof CONTACT_POSITION_FIELD]
          | Company[typeof COMPANY_1CCODE_FIELD];
        entity: "contact" | "company";
      }>
    ) => {
      if (entity === "contact") {
        let contact: Contact | undefined;
        state.companies.find(({ CONTACTS }) => {
          contact = CONTACTS.find(({ ID }) => ID === id);
          return !!contact;
        });
        contact && (contact[CONTACT_POSITION_FIELD] = value);
      }
      if (entity === "company") {
        let company = state.companies.find(({ ID }) => ID === id);
        company && (company[COMPANY_1CCODE_FIELD] = value);
      }
    },

    setListOfCompaniesWithNoCountryInContact: (state, { payload }) => {
      state.listOfCompaniesWithNoCountryInContact = payload;
    },
    setDifferentResponsibles: (state, { payload }) => {
      state.differentResponsibles = payload;
    },
    setContactsNoCountries: (
      state,
      { payload }: PayloadAction<TransferCountry>
    ) => {
      state.contactsNoCountries = payload;
    },
    setTotalAmount: (state, { payload }: PayloadAction<number>) => {
      state.totalAmount = payload;
    },
    setProcessedAmount: (state, { payload }: PayloadAction<number>) => {
      state.processedAmount =
        payload === 0 ? 0 : state.processedAmount + payload;
    },
  },
});

export const {
  setCompanies,
  setDifferentResponsibles,
  setTotalAmount,
  setProcessedAmount,
  setContactsNoCountries,
  changeField,
  setListOfCompaniesWithNoCountryInContact,
} = companySlice.actions;
export default companySlice;
