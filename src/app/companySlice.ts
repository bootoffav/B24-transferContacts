import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Company, Transfer, TransferCountry } from "../types";

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
} = companySlice.actions;
export default companySlice;
