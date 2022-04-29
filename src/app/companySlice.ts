import { createSlice } from "@reduxjs/toolkit";

export const companySlice = createSlice({
  name: "companies",
  initialState: {
    totalAmount: 0,
    processedAmount: 0,
    companiesWithContacts: [],
    differentResponsibles: [],
  },
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
