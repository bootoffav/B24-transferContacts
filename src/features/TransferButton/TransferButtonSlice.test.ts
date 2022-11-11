import "@testing-library/jest-dom";
import { store } from "../../app/store";
import transferButtonSlice, {
  setTransferType,
  resetState,
} from "./TransferButtonSlice";

describe("check TransferButtonSlice of redux store", function () {
  test("checks initial state set properly defined", function () {
    const { transferType } = transferButtonSlice.getInitialState();
    expect(transferType).toBeDefined();
    expect(transferType).toBe("all");
  });

  test("checks correct transferTypes can be set", function () {
    store.dispatch(resetState());

    // valid cases
    store.dispatch(setTransferType("contacts"));
    expect(store.getState().transferButton.transferType).toBe("contacts");

    store.dispatch(setTransferType("all"));
    expect(store.getState().transferButton.transferType).toBe("all");

    store.dispatch(setTransferType("leads"));
    expect(store.getState().transferButton.transferType).toBe("leads");

    store.dispatch(setTransferType("deals"));
    expect(store.getState().transferButton.transferType).toBe("deals");
  });

  test("check incorrect values cannot be set", function () {
    store.dispatch(resetState());
    // @ts-expect-error
    store.dispatch(setTransferType("deal"));
    expect(store.getState().transferButton.transferType).toBe(
      transferButtonSlice.getInitialState().transferType
    );

    // @ts-expect-error
    store.dispatch(setTransferType("something"));
    expect(store.getState().transferButton.transferType).toBe(
      transferButtonSlice.getInitialState().transferType
    );

    // @ts-expect-error
    store.dispatch(setTransferType(""));
    expect(store.getState().transferButton.transferType).toBe(
      transferButtonSlice.getInitialState().transferType
    );
  });

  test("state is properly reset", function () {
    // ARRANGE
    store.dispatch(setTransferType("deals"));
    //ACT
    store.dispatch(resetState());
    // ASSERT
    expect(store.getState().transferButton).toEqual(
      transferButtonSlice.getInitialState()
    );
  });
});
