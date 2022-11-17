import "@testing-library/jest-dom";
import { store } from "../../app/store";
import transferButtonSlice, {
  setTransferEntityType,
  setTransferType,
  resetState,
} from "./TransferButtonSlice";

describe("check TransferButtonSlice of redux store", function () {
  test("checks initial state set properly defined", function () {
    const { transferEntityType, transferType } =
      transferButtonSlice.getInitialState();
    expect(transferEntityType).toBeDefined();
    expect(transferEntityType).toBe("all");
    expect(transferType).toBeUndefined();
  });

  test("state is properly reset", function () {
    store.dispatch(setTransferEntityType("deals"));
    store.dispatch(resetState());
    expect(store.getState().transferButton).toEqual(
      transferButtonSlice.getInitialState()
    );
  });
});

describe("check transferEntityType behaviour", function () {
  test("checks correct transferEntityTypes can be set", function () {
    store.dispatch(resetState());

    // valid cases
    store.dispatch(setTransferEntityType("contacts"));
    expect(store.getState().transferButton.transferEntityType).toBe("contacts");

    store.dispatch(setTransferEntityType("all"));
    expect(store.getState().transferButton.transferEntityType).toBe("all");

    store.dispatch(setTransferEntityType("leads"));
    expect(store.getState().transferButton.transferEntityType).toBe("leads");

    store.dispatch(setTransferEntityType("deals"));
    expect(store.getState().transferButton.transferEntityType).toBe("deals");
  });

  test("check incorrect values for transferEntityType cannot be set", function () {
    store.dispatch(resetState());
    // @ts-expect-error
    store.dispatch(setTransferEntityType("deal"));
    expect(store.getState().transferButton.transferEntityType).toBe(
      transferButtonSlice.getInitialState().transferEntityType
    );

    // @ts-expect-error
    store.dispatch(setTransferEntityType("something"));
    expect(store.getState().transferButton.transferEntityType).toBe(
      transferButtonSlice.getInitialState().transferEntityType
    );

    // @ts-expect-error
    store.dispatch(setTransferEntityType(""));
    expect(store.getState().transferButton.transferEntityType).toBe(
      transferButtonSlice.getInitialState().transferEntityType
    );
  });
});

describe("check transferType manipulations", function () {
  test("transferType proper values can be set", function () {
    store.dispatch(setTransferType("responsible"));
    expect(store.getState().transferButton.transferType).toBe("responsible");
    store.dispatch(setTransferType("country"));
    expect(store.getState().transferButton.transferType).toBe("country");
  });
});
