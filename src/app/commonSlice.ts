import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Contact, Country, User } from "../types";
import { sort, splitActiveDismissed } from "../utils/users";
import { fetchCountries, fetchUsers } from "./endpoint";

enum Stage {
  initial,
  gettingData,
  cancelling,
  scanFinished,
  linkedInOnlyScanFinished,
  transferring,
  transferred,
}

export interface CommonState {
  stage: Stage;
  users: User[];
  transferredAmount: number;
  selectType: "users" | "countries";
  chosenId?: number;
  countries: Country[];
  modalHidden: boolean;
  contactIdForEmails?: Contact["ID"];
  linkedInOnly: boolean;
}

function isStage(stage: Stage): stage is Stage {
  return stage in Stage;
}

const initialState: CommonState = {
  modalHidden: true,
  stage: Stage.initial,
  users: [],
  selectType: "users",
  countries: [],
  transferredAmount: 0,
  linkedInOnly: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setStage: (state, { payload }: PayloadAction<CommonState["stage"]>) => {
      if (isStage(payload)) {
        state.stage = payload;
      }
    },
    setContactIdForEmails: (
      state,
      { payload }: PayloadAction<CommonState["contactIdForEmails"]>
    ) => {
      state.contactIdForEmails = payload;
    },
    setLinkedInOnly: (
      state,
      { payload }: PayloadAction<CommonState["linkedInOnly"]>
    ) => {
      state.linkedInOnly = payload;
    },
    setTransferredAmount: (state, { payload }: PayloadAction<number>) => {
      state.transferredAmount =
        payload === 0 ? 0 : state.transferredAmount + payload;
    },
    setSelectType: (
      state,
      { payload }: PayloadAction<CommonState["selectType"]>
    ) => {
      state.selectType = payload;
    },
    setChosenId: (state, { payload }: PayloadAction<number | undefined>) => {
      state.chosenId = payload;
    },
    hideModal: (state, { payload }: PayloadAction<boolean>) => {
      state.modalHidden = payload;
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

export const {
  setStage,
  setChosenId,
  setSelectType,
  setTransferredAmount,
  hideModal,
  setContactIdForEmails,
  setLinkedInOnly,
} = commonSlice.actions;
export { Stage };
export default commonSlice;
