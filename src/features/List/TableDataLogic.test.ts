import { formColumns } from "./TableDataLogic";
import { store } from "app/store";
import { useAppDispatch } from "app/hooks";
import { setCheckboxOption } from "features/Options/OptionsSlice";

describe("correct columns received", function () {
  test("base columns + lead columns", function () {
    store.dispatch(
      setCheckboxOption({ what: "includeDeals", newValue: false })
    );
    const testThis = formColumns(store.dispatch);
    expect(testThis.length).toBe(10);
  });

  test("base columns + deal columns", function () {
    store.dispatch(setCheckboxOption({ what: "includeDeals", newValue: true }));
    store.dispatch(
      setCheckboxOption({ what: "includeLeads", newValue: false })
    );
    const testThis = formColumns(store.dispatch);
    expect(testThis.length).toBe(10);
  });

  test("base columns + deal and lead columns", function () {
    store.dispatch(setCheckboxOption({ what: "includeDeals", newValue: true }));
    store.dispatch(setCheckboxOption({ what: "includeLeads", newValue: true }));
    const testThis = formColumns(store.dispatch);
    expect(testThis.length).toBe(12);
  });
});
