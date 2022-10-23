import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const viewModeAll = "all";
export const viewModeNoCountries = "noCountries";
export const viewModeWithLinkedIn = "withLinkedIn";
export const viewModeContactsCountryNone = "noCountry";

interface ListSliceState {
  viewMode:
    | typeof viewModeAll
    | typeof viewModeNoCountries
    | typeof viewModeWithLinkedIn
    | typeof viewModeContactsCountryNone;
}

const initialState: ListSliceState = {
  viewMode: viewModeAll,
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setViewMode(state, { payload }: PayloadAction<ListSliceState["viewMode"]>) {
      if (
        [
          viewModeAll,
          viewModeNoCountries,
          viewModeWithLinkedIn,
          viewModeContactsCountryNone,
        ].includes(payload)
      ) {
        state.viewMode = payload;
      }
    },
  },
});

export const { setViewMode } = listSlice.actions;
export default listSlice;
