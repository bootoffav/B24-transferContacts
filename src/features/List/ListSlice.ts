import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const viewModeAll = "all";
export const viewModeNoCountries = "noCountries";

interface ListSliceState {
  viewMode: typeof viewModeAll | typeof viewModeNoCountries;
}

const initialState: ListSliceState = {
  viewMode: "all",
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setViewMode(state, { payload }: PayloadAction<ListSliceState["viewMode"]>) {
      if ([viewModeAll, viewModeNoCountries].includes(payload)) {
        state.viewMode = payload;
      }
    },
  },
});

export const { setViewMode } = listSlice.actions;
export default listSlice;
