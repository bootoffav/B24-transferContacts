import listSlice, { setViewMode } from "./listSlice";

const { reducer } = listSlice;
describe("list reducer: viewMode check", () => {
  it("should return initial state when passed an empty action", () => {
    const { viewMode } = reducer(undefined, { type: "" });
    expect(viewMode).toEqual("all");
  });

  it("should update state when passing correct action and payload", () => {
    const actionSetNoCountries = {
      type: "list/setViewMode",
      payload: "noCountries",
    };
    expect(reducer(undefined, actionSetNoCountries).viewMode).toEqual(
      "noCountries"
    );
  });

  it("should not mutate state if payload is improper", () => {
    const malformedAction = {
      type: "list/setViewMode",
      payload: "wrong payload",
    };
    expect(reducer(undefined, malformedAction).viewMode).toEqual("all");
  });
});
