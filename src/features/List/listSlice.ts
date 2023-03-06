import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const viewModeAll = "all";
export const viewModeNoCountries = "noCountries";
export const viewModeWithLinkedIn = "withLinkedIn";
export const viewModeContactsCountryNone = "noCountry";
export const viewModeDiffs = "diffs";
export const viewModeCustom = "custom";

export interface ListSliceState {
  viewMode:
    | typeof viewModeAll
    | typeof viewModeNoCountries
    | typeof viewModeWithLinkedIn
    | typeof viewModeDiffs
    | typeof viewModeCustom
    | typeof viewModeContactsCountryNone;
  pageIndex: number;
  customViewEntityType?: "CONTACTS" | "LEADS" | "DEALS";
  customViewUserId?: number;
}

const initialState: ListSliceState = {
  viewMode: viewModeDiffs,
  pageIndex: 0,
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setViewMode(
      state,
      {
        payload,
      }: PayloadAction<{
        viewMode: ListSliceState["viewMode"];
        customViewEntityType?: ListSliceState["customViewEntityType"];
        customViewUserId?: ListSliceState["customViewUserId"];
      }>
    ) {
      if (
        [
          viewModeAll,
          viewModeNoCountries,
          viewModeWithLinkedIn,
          viewModeContactsCountryNone,
          viewModeDiffs,
          viewModeCustom,
        ].includes(payload.viewMode)
      ) {
        state.viewMode = payload.viewMode;
        state.customViewEntityType = payload.customViewEntityType;
        state.customViewUserId = payload.customViewUserId;
        state.pageIndex = 0;
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
