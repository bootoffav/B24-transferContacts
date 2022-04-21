import { createSlice } from "@reduxjs/toolkit";
// import { setCompanies } from "../../app/companySlice";

interface CountrySelectorState {
  countries: [];
  chosenCountryId: string;
}

const initialState: CountrySelectorState = {
  countries: [],
  chosenCountryId: "",
};

export const countrySelectorSlice = createSlice({
  name: "countrySelector",
  initialState,
  reducers: {
    add: (state, action) => {
      state.countries = action.payload;
    },
    setChosenCountryId: (state, action) => {
      state.chosenCountryId = action.payload;
    },
  },
});

export const { add, setChosenCountryId } = countrySelectorSlice.actions;
export default countrySelectorSlice.reducer;
