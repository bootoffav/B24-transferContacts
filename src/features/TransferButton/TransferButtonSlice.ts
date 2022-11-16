import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

const sliceName = "transferButton";

const resetState = createAction(`${sliceName}/reset`);

const allTransferEntityTypes = ["contacts", "leads", "deals", "all"] as const;
// const transferType: "entity" | "country" = "entity" as const;

interface TransferButtonState {
  transferEntityType: typeof allTransferEntityTypes[number];
  transferType: "entity" | "country";
}

const initialState: TransferButtonState = {
  transferEntityType: "all",
  transferType: "entity",
};

const transferButtonSlice = createSlice({
  name: sliceName,
  initialState: { ...initialState },
  reducers: {
    setTransferEntityType: (
      state,
      { payload }: PayloadAction<TransferButtonState["transferEntityType"]>
    ) => {
      if (allTransferEntityTypes.includes(payload)) {
        state.transferEntityType = payload;
      }
    },
  },
  extraReducers: {
    [resetState.toString()]: () => ({ ...initialState }),
  },
});

export const { setTransferEntityType } = transferButtonSlice.actions;
export { allTransferEntityTypes, resetState };
export default transferButtonSlice;
