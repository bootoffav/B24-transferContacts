import optionsSlice, { setCheckboxOption } from "./OptionsSlice";
import { store } from "app/store";

const { getState, dispatch } = store;

describe("check optionsSlice state", function () {
  test("check initial state is correct", function () {
    const { includeDeals, includeLeads } = optionsSlice.getInitialState();
    expect(includeDeals).toBe(true);
    expect(includeLeads).toBe(true);
  });

  test("check setCheckboxtOption", function () {
    dispatch(setCheckboxOption("includeDeals", true));
    expect(getState().options.includeDeals).toBe(true);

    dispatch(setCheckboxOption("includeDeals", false));
    expect(getState().options.includeDeals).toBe(false);

    dispatch(setCheckboxOption("includeLeads", true));
    expect(getState().options.includeLeads).toBe(true);

    dispatch(setCheckboxOption("includeLeads", false));
    expect(getState().options.includeDeals).toBe(false);
  });
});
