import listSlice, { setViewMode } from "./listSlice";

const { reducer } = listSlice;
describe("list reducer", () => {
  it("should return initial state when passed an empty action", () => {
    const result = reducer(undefined, { type: "" });
    expect(result).toEqual({ viewMode: "all" });
  });

  it("should update state when passing correct action and payload", () => {
    const actionSetNoCountries = {
      type: "list/setViewMode",
      payload: "noCountries",
    };
    expect(reducer(undefined, actionSetNoCountries)).toEqual({
      viewMode: "noCountries",
    });
  });

  it("should not mutate state if payload is improper", () => {
    const malformedAction = {
      type: "list/setViewMode",
      payload: "wrong payload",
    };
    expect(reducer(undefined, malformedAction)).toEqual({
      viewMode: "all",
    });
  });
});
