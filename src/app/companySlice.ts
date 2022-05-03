import { createSlice } from "@reduxjs/toolkit";
import { Company, Transfer } from "../types";

interface CompanyState {
  totalAmount: number;
  processedAmount: number;
  companiesWithContacts: Company[];
  differentResponsibles: Transfer;
}

const initialState: CompanyState = {
  totalAmount: 0,
  processedAmount: 0,
  companiesWithContacts: [],
  differentResponsibles: [],
};

export const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanies: (state, { payload }) => {
      state.companiesWithContacts = payload;
    },
    setDifferentResponsibles: (state, { payload }) => {
      state.differentResponsibles = payload;
    },
    setTotalAmount: (state, { payload }) => {
      state.totalAmount = payload;
    },
    setProcessedAmount: (state, { payload }) => {
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
} = companySlice.actions;
export default companySlice.reducer;
