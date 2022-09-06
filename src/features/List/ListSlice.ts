import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ListSliceState {
  viewMode: "all" | "noCountries";
}

const initialState: ListSliceState = {
  viewMode: "all",
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setViewMode(state, { payload }: PayloadAction<ListSliceState["viewMode"]>) {
      if ((["all", "noCountries"] as const).includes(payload)) {
        state.viewMode = payload;
      }

      return state;
    },
  },
});

export const { setViewMode } = listSlice.actions;
export default listSlice;
