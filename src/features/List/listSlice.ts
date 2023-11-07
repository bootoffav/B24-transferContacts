import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const enum ViewMode {
  all = "all",
  noCountries = "noCountries",
  noCountriesInContacts = "noCountriesInContacts",
  withLinkedIn = "withLinkedIn",
  diffs = "diffs",
  noEmail = "noEmail",
  custom = "custom",
}

export interface ListSliceState {
  viewMode: ViewMode;
  pageIndex: number;
  customViewEntityType?: "CONTACTS" | "LEADS" | "DEALS" | "COMPANIES";
  customViewId?: number;
  customCountryAndUser?: true;
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
          customViewId?: ListSliceState["customViewId"];
          customCountryAndUser: ListSliceState["customCountryAndUser"];
        }>
      ) {
        state.viewMode = payload.viewMode;
        state.customViewEntityType = payload.customViewEntityType;
        state.customViewId = payload.customViewId;
        if (payload.customCountryAndUser !== undefined) {
          state.customCountryAndUser = payload.customCountryAndUser;
        } else {
          delete state.customCountryAndUser;
        }
        state.pageIndex = 0;
      },
      prepare(
        viewMode: ListSliceState["viewMode"],
        customViewEntityType?,
        customViewId?,
        customCountryAndUser?
      ) {
        return {
          payload: {
            viewMode,
            customViewEntityType,
            customViewId,
            customCountryAndUser,
          },
        };
      },
    },
    setPageIndex(
      state,
      {
        payload,
      }: PayloadAction<
        | ListSliceState["pageIndex"]
        | {
            value: number;
            options?: {
              exact: boolean;
            };
          }
      >
    ) {
      if (typeof payload === "number") {
        const result = state.pageIndex + payload;
        state.pageIndex = result > 0 ? result : 0;
        return;
      }
      if (payload.options?.exact) state.pageIndex = payload.value;
    },
  },
});

export const { setViewMode, setPageIndex } = listSlice.actions;
export default listSlice;
