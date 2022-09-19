import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const viewModeAll = "all";
export const viewModeNoCountries = "noCountries";
export const viewModeWithLinkedIn = "withLinkedIn";

interface ListSliceState {
  viewMode:
    | typeof viewModeAll
    | typeof viewModeNoCountries
    | typeof viewModeWithLinkedIn;
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
        [viewModeAll, viewModeNoCountries, viewModeWithLinkedIn].includes(
          payload
        )
      ) {
        state.viewMode = payload;
      }
    },
  },
});

export const { setViewMode } = listSlice.actions;
export default listSlice;
