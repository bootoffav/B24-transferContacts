import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

const sliceName = "transferButton";

const resetState = createAction(`${sliceName}/reset`);

const allTransferEntityTypes = ["contacts", "leads", "deals", "all"] as const;

interface TransferButtonState {
  transferEntityType: typeof allTransferEntityTypes[number];
  transferType?: "responsible" | "country";
}

const initialState: TransferButtonState = {
  transferEntityType: "all",
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
    setTransferType: (
      state,
      { payload }: PayloadAction<TransferButtonState["transferType"]>
    ) => {
      state.transferType = payload;
    },
  },
  extraReducers: {
    [resetState.toString()]: () => ({ ...initialState }),
  },
});

export const { setTransferEntityType, setTransferType } =
  transferButtonSlice.actions;
export { allTransferEntityTypes, resetState };
export default transferButtonSlice;
