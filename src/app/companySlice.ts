import { createSlice } from "@reduxjs/toolkit";

export const companySlice = createSlice({
  name: "companies",
  initialState: {
    companiesWithContacts: [],
  },
  reducers: {
    set: (state, action) => {
      state.companiesWithContacts = action.payload;
    },
  },
});

export const { set } = companySlice.actions;
export default companySlice.reducer;
