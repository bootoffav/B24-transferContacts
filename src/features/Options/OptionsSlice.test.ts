import optionsSlice, { setCheckboxOption } from "./OptionsSlice";
import { store } from "app/store";

describe("check optionsSlice state", function () {
  test("check initial state is correct", function () {
    const { includeDeals, includeLeads } = optionsSlice.getInitialState();
    expect(includeDeals).toBe(true);
    expect(includeLeads).toBe(true);
  });

  test("check setCheckboxtOption", function () {
    store.dispatch(setCheckboxOption({ what: "includeDeals", newValue: true }));
    expect(store.getState().options.includeDeals).toBe(true);

    store.dispatch(
      setCheckboxOption({ what: "includeDeals", newValue: false })
    );
    expect(store.getState().options.includeDeals).toBe(false);

    store.dispatch(setCheckboxOption({ what: "includeLeads", newValue: true }));
    expect(store.getState().options.includeLeads).toBe(true);

    store.dispatch(
      setCheckboxOption({ what: "includeLeads", newValue: false })
    );
    expect(store.getState().options.includeDeals).toBe(false);
  });
});
