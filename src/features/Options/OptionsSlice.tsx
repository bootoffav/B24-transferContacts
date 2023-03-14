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
    setCheckboxOption: {
      reducer(
        state,
        {
          payload: [what, newValue],
        }: PayloadAction<readonly [keyof OptionsState, boolean]>
      ) {
        state[what] = newValue;
      },
      prepare: (what: keyof OptionsState, newValue: boolean) => ({
        payload: [what, newValue] as const,
      }),
    },
  },
});

export const { setCheckboxOption } = optionsSlice.actions;
export type { OptionsState };
export { includeCheckboxes, optionsSlice as default };
