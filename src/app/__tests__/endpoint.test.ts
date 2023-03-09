import { store } from "app/store";
import { Departments } from "types";
import { fetchDepartments, fetchUsers } from "../endpoint";

jest.setTimeout(10000);

describe("test function that communicate with API", function () {
  test("checks fetchDepatments", async function () {
    const { getState, dispatch } = store;
    const deps: Departments = {
      IT: [7, [5]],
    };
    await dispatch(fetchUsers());
    await dispatch(fetchDepartments());
    const actualDeps = getState().common.departments;

    expect(actualDeps).toEqual(expect.objectContaining(deps));
  });
});
