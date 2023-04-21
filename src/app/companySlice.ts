import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company, Contact, Transfer, TransferCountry } from "../types";
import { CONTACT_POSITION_FIELD } from "./CONSTANTS";

export interface CompanyState {
  totalAmount: number;
  processedAmount: number;
  companies: Company[];
  differentResponsibles: Transfer;
  contactsNoCountries: TransferCountry;
}

const initialState: CompanyState = {
  totalAmount: 0,
  processedAmount: 0,
  companies: [],
  differentResponsibles: [],
  contactsNoCountries: [],
};

export const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanies: (state, { payload }) => {
      state.companies = payload;
    },

    changeContactPosition: (
      state,
      {
        payload: { id, position },
      }: PayloadAction<{
        id: Contact["ID"];
        position: Contact["UF_CRM_1634268517946"];
      }>
    ) => {
      let contact: Contact | undefined;
      state.companies.find(({ CONTACTS }) => {
        contact = CONTACTS.find(({ ID }) => ID === id);
        return !!contact;
      });
      contact && (contact[CONTACT_POSITION_FIELD] = position);
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
  changeContactPosition,
} = companySlice.actions;
export default companySlice;
