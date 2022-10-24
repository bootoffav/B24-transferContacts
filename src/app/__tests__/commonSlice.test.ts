import commonSlice, {
  setChosenId,
  setSelectType,
  Stage,
} from "app/commonSlice";
import { store } from "../store";
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
    expect(initState.chosenId).toEqual([]);
  });

  test("checks setChosenId", function () {
    store.dispatch(setChosenId([1]));
    expect(store.getState().common.chosenId).toEqual([1]);

    store.dispatch(setChosenId([14, 16, 200]));
    expect(store.getState().common.chosenId).toEqual([14, 16, 200]);
  });

  test("checks setSelectType works correctly", async function () {
    store.dispatch(setSelectType("departments"));
    expect(store.getState().common.selectType).toBe("departments");
    store.dispatch(setSelectType("users"));
    expect(store.getState().common.selectType).toBe("users");
    store.dispatch(setSelectType("companyCountryList"));
    expect(store.getState().common.selectType).toBe("companyCountryList");
  });
});
