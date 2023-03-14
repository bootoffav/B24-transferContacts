import { formColumns } from "./TableDataLogic";
import { store } from "app/store";
import { useAppDispatch } from "app/hooks";
import { setCheckboxOption } from "features/Options/OptionsSlice";

const { dispatch } = store;
describe("correct columns received", function () {
  test("base columns + lead columns", function () {
    dispatch(setCheckboxOption("includeDeals", false));
    const testThis = formColumns(dispatch);
    expect(testThis.length).toBe(10);
  });

  test("base columns + deal columns", function () {
    dispatch(setCheckboxOption("includeDeals", true));
    dispatch(setCheckboxOption("includeLeads", false));
    const testThis = formColumns(dispatch);
    expect(testThis.length).toBe(10);
  });

  test("base columns + deal and lead columns", function () {
    dispatch(setCheckboxOption("includeDeals", true));
    dispatch(setCheckboxOption("includeLeads", true));
    const testThis = formColumns(store.dispatch);
    expect(testThis.length).toBe(12);
  });
});
