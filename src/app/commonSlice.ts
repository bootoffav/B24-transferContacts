import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types";

export interface CommonState {
  stage:
    | "initial"
    | "gettingData"
    | "scanFinished"
    | "transferring"
    | "transferred";
  users: any[];
  selectType: "manager" | "country";
  chosenId: string;
}

const initialState: CommonState = {
  stage: "initial",
  users: [],
  selectType: "manager",
  chosenId: "",
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
    setSelectType: (state, { payload }) => {
      state.selectType = payload;
    },
    setChosenId: (state, { payload }) => {
      state.chosenId = payload;
    },
    addUsers: (state, { payload: users }) => {
      // sort
      users.sort((a: User, b: User) => {
        if (a.NAME > b.NAME) return 1;
        if (a.NAME < b.NAME) return -1;
        return 0;
      });
      // divide users: active ones will go first, dismissed will go last
      let activeUsers: User[] = [];
      let dismissedUsers: User[] = [];
      users.forEach((user: User) => {
        user.ACTIVE ? activeUsers.push(user) : dismissedUsers.push(user);
      });

      activeUsers.unshift({
        ID: "",
        NAME: "none",
        LAST_NAME: "",
        ACTIVE: true,
      });
      state.users = [...activeUsers, ...dismissedUsers];
    },
  },
});

export const { setStage, setUsers, setChosenId, setSelectType, addUsers } =
  commonSlice.actions;
export default commonSlice.reducer;
