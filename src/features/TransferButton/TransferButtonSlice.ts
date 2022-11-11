import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

const sliceName = "transferButton";

const resetState = createAction(`${sliceName}/reset`);

const allTransferTypes = ["contacts", "leads", "deals", "all"] as const;

interface TransferButtonState {
  transferType: typeof allTransferTypes[number];
}

const initialState: TransferButtonState = {
  transferType: "all",
};

const transferButtonSlice = createSlice({
  name: sliceName,
  initialState: { ...initialState },
  reducers: {
    setTransferType: (
      state,
      { payload }: PayloadAction<TransferButtonState["transferType"]>
    ) => {
      if (allTransferTypes.includes(payload)) {
        state.transferType = payload;
      }
    },
  },
  extraReducers: {
    [resetState.toString()]: () => ({ ...initialState }),
  },
});

export const { setTransferType } = transferButtonSlice.actions;
export { allTransferTypes, resetState };
export default transferButtonSlice;
