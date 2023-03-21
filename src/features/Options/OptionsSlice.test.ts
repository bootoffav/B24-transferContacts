import optionsSlice, { setCheckboxOption } from "./OptionsSlice";

const { reducer } = optionsSlice;
describe("check optionsSlice state", function () {
  test("check initial state is correct", function () {
    const { includeDeals, includeLeads } = optionsSlice.getInitialState();
    expect(includeDeals).toBe(true);
    expect(includeLeads).toBe(true);
  });

  test("check setCheckboxtOption", function () {
    var { includeDeals } = reducer(
      undefined,
      setCheckboxOption("includeDeals", true)
    );
    expect(includeDeals).toBe(true);

    var { includeDeals } = reducer(
      undefined,
      setCheckboxOption("includeDeals", false)
    );
    expect(includeDeals).toBe(false);

    var { includeLeads } = reducer(
      undefined,
      setCheckboxOption("includeLeads", true)
    );
    expect(includeLeads).toBe(true);

    var { includeLeads } = reducer(
      undefined,
      setCheckboxOption("includeLeads", false)
    );
    expect(includeDeals).toBe(false);
  });
});
