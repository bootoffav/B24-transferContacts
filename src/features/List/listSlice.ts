import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const enum ViewMode {
  all = "all",
  noCountries = "noCountries",
  withLinkedIn = "withLinkedIn",
  diffs = "diffs",
  noEmail = "noEmail",
  custom = "custom",
}

export interface ListSliceState {
  viewMode: ViewMode;
  pageIndex: number;
  customViewEntityType?: "CONTACTS" | "LEADS" | "DEALS" | "COMPANIES";
  customViewUserId?: number;
}

const initialState: ListSliceState = {
  viewMode: ViewMode.diffs,
  pageIndex: 0,
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setViewMode: {
      reducer(
        state,
        {
          payload,
        }: PayloadAction<{
          viewMode: ListSliceState["viewMode"];
          customViewEntityType?: ListSliceState["customViewEntityType"];
          customViewUserId?: ListSliceState["customViewUserId"];
        }>
      ) {
        state.viewMode = payload.viewMode;
        state.customViewEntityType = payload.customViewEntityType;
        state.customViewUserId = payload.customViewUserId;
        state.pageIndex = 0;
      },
      prepare(
        viewMode: ListSliceState["viewMode"],
        customViewEntityType?,
        customViewUserId?
      ) {
        return {
          payload: {
            viewMode,
            customViewEntityType,
            customViewUserId,
          },
        };
      },
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
