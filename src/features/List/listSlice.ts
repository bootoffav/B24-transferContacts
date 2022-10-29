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
  pageIndex: number;
}

const initialState: ListSliceState = {
  viewMode: viewModeAll,
  pageIndex: 0,
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
    setPageIndex(
      state,
      { payload }: PayloadAction<ListSliceState["pageIndex"]>
    ) {
      state.pageIndex += payload;
    },
  },
});

export const { setViewMode, setPageIndex } = listSlice.actions;
export default listSlice;
