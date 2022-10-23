import { store } from "app/store";
import { Departments } from "types";
import { fetchDepartments, fetchUsers } from "../endpoint";

jest.setTimeout(10000);

describe("test function that communicate with API", function () {
  test("checks fetchDepatments", async function () {
    const departments: Departments = {
      "IT department": [7, [5]],
    };
    await store.dispatch(fetchUsers());
    await store.dispatch(fetchDepartments());
    expect(store.getState().common.departments).toEqual(
      expect.objectContaining(departments)
    );
  });
});
