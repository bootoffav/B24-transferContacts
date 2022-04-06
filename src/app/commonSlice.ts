import { createSlice } from "@reduxjs/toolkit";

interface CommonInitialState {
  stage: "initial" | "gettingUsers" | "gettingCompanies" | "scanFinished";
  users: any[];
}

const initialState: CommonInitialState = {
  stage: "initial",
  users: [],
};
const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setStage: (state, { payload }) => {
      state.stage = payload;
    },
    setUsers: (state, { payload }) => {
      state.users = payload;
    },
  },
});

export const { setStage, setUsers } = commonSlice.actions;
export default commonSlice.reducer;
