import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Country, User } from "../types";

export interface CommonState {
  stage:
    | "initial"
    | "gettingData"
    | "scanFinished"
    | "transferring"
    | "transferred";
  users: User[];
  transferredAmount: number;
  selectType: "users" | "countries";
  chosenId: string;
  countries: Country[];
}

const initialState: CommonState = {
  stage: "initial",
  users: [],
  selectType: "users",
  chosenId: "",
  countries: [],
  transferredAmount: 0,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setStage: (state, { payload }: PayloadAction<CommonState["stage"]>) => {
      state.stage = payload;
    },
    setTransferredAmount: (state, { payload }) => {
      state.transferredAmount =
        payload === 0 ? 0 : state.transferredAmount + payload;
    },
    setSelectType: (
      state,
      { payload }: PayloadAction<CommonState["selectType"]>
    ) => {
      state.selectType = payload;
    },
    setChosenId: (state, { payload }: PayloadAction<string>) => {
      state.chosenId = payload;
    },
    addCountries: (state, { payload }: PayloadAction<Country[]>) => {
      state.countries = payload;
    },
    addUsers: (state, { payload: users }: PayloadAction<User[]>) => {
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
        ID: 0,
        NAME: "none",
        LAST_NAME: "",
        ACTIVE: true,
      });
      state.users = [...activeUsers, ...dismissedUsers];
    },
  },
});

export const {
  setStage,
  setChosenId,
  setSelectType,
  addUsers,
  addCountries,
  setTransferredAmount,
} = commonSlice.actions;
export default commonSlice.reducer;
