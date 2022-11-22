import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const includeCheckboxes = ["includeLeads", "includeDeals"] as const;

type OptionsState = {
  [P in typeof includeCheckboxes[number]]: boolean;
};

const initialState: OptionsState = {
  includeLeads: true,
  includeDeals: true,
};

const optionsSlice = createSlice({
  name: "checkbox",
  initialState,
  reducers: {
    setCheckboxOption: (
      state,
      {
        payload,
      }: PayloadAction<{
        what: typeof includeCheckboxes[number];
        newValue: boolean;
      }>
    ) => {
      state[payload.what] = payload.newValue;
    },
  },
});

export const { setCheckboxOption } = optionsSlice.actions;
export type { OptionsState };
export { includeCheckboxes, optionsSlice as default };
