import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const viewModeAll = "all";
export const viewModeNoCountries = "noCountries";
export const viewModeWithLinkedIn = "withLinkedIn";
export const viewModeContactsCountryNone = "noCountry";
export const viewModeDiffs = "diffs";

export interface ListSliceState {
  viewMode:
    | typeof viewModeAll
    | typeof viewModeNoCountries
    | typeof viewModeWithLinkedIn
    | typeof viewModeDiffs
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
          viewModeDiffs,
        ].includes(payload)
      ) {
        state.viewMode = payload;
      } else {
        throw new Error(`viewMode ${payload} does not exist`);
      }
    },
    setPageIndex(
      state,
      { payload }: PayloadAction<ListSliceState["pageIndex"]>
    ) {
      const result = state.pageIndex + payload;
      state.pageIndex = result > 0 ? result : 0;
    },
  },
});

export const { setViewMode, setPageIndex } = listSlice.actions;
export default listSlice;
