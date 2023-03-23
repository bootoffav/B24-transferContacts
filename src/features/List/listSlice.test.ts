import listSlice, { ViewMode, setViewMode } from "./listSlice";

const { reducer } = listSlice;
describe("list reducer: viewMode check", () => {
  it("should return initial state when passed an empty action", () => {
    const { viewMode } = reducer(undefined, { type: "" });
    expect(viewMode).toEqual(ViewMode.diffs);
  });

  it("should update state when passing correct action and payload", () => {
    // no countries
    const noCountries = reducer(
      undefined,
      setViewMode(ViewMode.noCountries)
    ).viewMode;
    expect(noCountries).toBe(ViewMode.noCountries);

    // no email
    const noEmails = reducer(undefined, setViewMode(ViewMode.noEmail)).viewMode;
    expect(noEmails).toBe(ViewMode.noEmail);
  });
});

describe("list reducer: pageIndex check", () => {
  it("should return previous pageIndex if passed an empty action", () => {
    const { pageIndex } = reducer(undefined, { type: "" });
    expect(pageIndex).toBe(0);
  });

  it("should update pageIndex when passing correct action and payload", () => {
    const actionSetPageIndex10 = {
      type: "list/setPageIndex",
      payload: 10,
    };
    const actionSetPageIndexMinus10 = {
      type: "list/setPageIndex",
      payload: -10,
    };
    expect(reducer(undefined, actionSetPageIndex10).pageIndex).toBe(10);
    expect(
      reducer(
        { pageIndex: 30, viewMode: ViewMode.all },
        actionSetPageIndexMinus10
      ).pageIndex
    ).toBe(20);
  });
  it("should not be below zero", () => {
    const actionSetPageIndexMinus1 = {
      type: "list/setPageIndex",
      payload: -1,
    };

    expect(
      reducer(
        { viewMode: ViewMode.all, pageIndex: 0 },
        actionSetPageIndexMinus1
      ).pageIndex
    ).toBe(0);
  });
});
