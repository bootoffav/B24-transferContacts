import commonSlice, { Stage } from "app/commonSlice";
import { Departments } from "types";

describe("checks commonState operations", function () {
  test("check default values is set", function () {
    const initState = commonSlice.getInitialState();
    const departments: Departments = {};

    expect(initState.modalHidden).toBe(true);
    expect(initState.stage).toBe(Stage.initial);
    expect(initState.users).toEqual([]);
    expect(initState.selectType).toBe("users");
    expect(initState.companyCountryList).toEqual([]);
    expect(initState.contactCountryList).toEqual([]);
    expect(initState.transferredAmount).toBe(0);
    expect(initState.linkedInOnly).toBe(false);
    expect(initState.departments).toEqual(departments);
  });

  // test('')
});
