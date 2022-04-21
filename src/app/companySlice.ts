import { createSlice } from "@reduxjs/toolkit";

export const companySlice = createSlice({
  name: "companies",
  initialState: {
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
  },
});

export const { setCompanies, setDifferentResponsibles } = companySlice.actions;
export default companySlice.reducer;
