import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Contact, Country, Departments, User } from "../types";
import { sort, splitActiveDismissed } from "../utils/users";
import { fetchCountries, fetchDepartments, fetchUsers } from "./endpoint";

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
  selectType: "users" | "companyCountryList";
  chosenId?: number;
  companyCountryList: Country[];
  contactCountryList: Country[];
  modalHidden: boolean;
  contactIdForEmails?: Contact["ID"];
  linkedInOnly: boolean;
  departments: Departments;
}

function isStage(stage: Stage): stage is Stage {
  return stage in Stage;
}

const initialState: CommonState = {
  modalHidden: true,
  stage: Stage.initial,
  users: [],
  selectType: "users",
  companyCountryList: [],
  contactCountryList: [],
  transferredAmount: 0,
  linkedInOnly: false,
  departments: {},
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
      .addCase(
        fetchCountries.fulfilled,
        (state, { payload: [companyCountryList, contactCountryList] }) => {
          state.companyCountryList = companyCountryList;
          state.contactCountryList = contactCountryList;
        }
      )
      .addCase(fetchUsers.fulfilled, (state, { payload: users }) => {
        users = splitActiveDismissed(sort(users));
        // add empty first
        state.users = [
          {
            ID: 0,
            NAME: "none",
            LAST_NAME: "",
            ACTIVE: true,
            UF_DEPARTMENT: [0],
          },
          ...users,
        ];
      })
      .addCase(fetchDepartments.fulfilled, (state, { payload }) => {
        state.departments = payload;
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
