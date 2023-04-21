import { formColumns } from "./TableDataLogic";
import { store } from "app/store";
import { setCheckboxOption } from "features/Options/OptionsSlice";

const { dispatch } = store;
describe("correct columns received", function () {
  test("base columns + lead columns", function () {
    dispatch(setCheckboxOption("includeDeals", false));
    expect(formColumns().length).toBe(11);
  });

  test("base columns + deal columns", function () {
    dispatch(setCheckboxOption("includeDeals", true));
    dispatch(setCheckboxOption("includeLeads", false));
    expect(formColumns().length).toBe(11);
  });

  test("base columns + deal and lead columns", function () {
    dispatch(setCheckboxOption("includeDeals", true));
    dispatch(setCheckboxOption("includeLeads", true));
    expect(formColumns().length).toBe(13);
  });
});
