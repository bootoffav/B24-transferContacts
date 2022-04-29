import { createSlice } from "@reduxjs/toolkit";

interface CountrySelectorState {
  countries: [];
}

const initialState: CountrySelectorState = {
  countries: [],
};

export const countrySelectorSlice = createSlice({
  name: "countrySelector",
  initialState,
  reducers: {
    add: (state, action) => {
      state.countries = action.payload;
    },
  },
});

export const { add } = countrySelectorSlice.actions;
export default countrySelectorSlice.reducer;
