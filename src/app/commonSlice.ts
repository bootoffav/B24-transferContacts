import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Country, User } from "../types";
import { sort, splitActiveDismissed } from "../utils/users";
import { fetchCountries, fetchUsers } from "./endpoint";

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
  chosenId?: number;
  countries: Country[];
}

const initialState: CommonState = {
  stage: "initial",
  users: [],
  selectType: "users",
  countries: [],
  transferredAmount: 0,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setStage: (
      state: CommonState,
      { payload }: PayloadAction<CommonState["stage"]>
    ) => {
      state.stage = payload;
    },
    setTransferredAmount: (
      state: CommonState,
      { payload }: PayloadAction<number>
    ) => {
      state.transferredAmount =
        payload === 0 ? 0 : state.transferredAmount + payload;
    },
    setSelectType: (
      state: CommonState,
      { payload }: PayloadAction<CommonState["selectType"]>
    ) => {
      state.selectType = payload;
    },
    setChosenId: (
      state: CommonState,
      { payload }: PayloadAction<number | undefined>
    ) => {
      state.chosenId = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.fulfilled, (state, { payload }) => {
        state.countries = payload;
      })
      .addCase(fetchUsers.fulfilled, (state, { payload: users }) => {
        users = splitActiveDismissed(sort(users));
        // add empty first
        state.users = [
          {
            ID: 0,
            NAME: "none",
            LAST_NAME: "",
            ACTIVE: true,
          },
          ...users,
        ];
      });
  },
});

export const { setStage, setChosenId, setSelectType, setTransferredAmount } =
  commonSlice.actions;
export default commonSlice;
