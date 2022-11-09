import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const allTransferTypes = ["contacts", "leads", "deals", "all"] as const;

interface TransferButtonState {
  transferType: typeof allTransferTypes[number];
}

const initialState: TransferButtonState = {
  transferType: "all",
};

const transferButtonSlice = createSlice({
  name: "transferButton",
  initialState,
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
});

export const { setTransferType } = transferButtonSlice.actions;
export { allTransferTypes };
export default transferButtonSlice;
