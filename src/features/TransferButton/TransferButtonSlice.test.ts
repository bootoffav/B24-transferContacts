import transferButtonSlice, {
  setTransferEntityType,
  setTransferType,
  resetState,
} from "./TransferButtonSlice";

const { reducer } = transferButtonSlice;
describe("check TransferButtonSlice of redux store", function () {
  test("checks initial state set properly defined", function () {
    const { transferEntityType, transferType } =
      transferButtonSlice.getInitialState();
    expect(transferEntityType).toBeDefined();
    expect(transferEntityType).toBe("all");
    expect(transferType).toBeUndefined();
  });

  test("state is properly reset", function () {
    const res = reducer(undefined, setTransferEntityType("deals"));
    const testableResult = reducer(res, resetState());
    expect(testableResult).toEqual(transferButtonSlice.getInitialState());
  });
});

describe("check transferEntityType behaviour", function () {
  test("checks correct transferEntityTypes can be set", function () {
    reducer(undefined, resetState());

    // valid cases
    expect(
      reducer(undefined, setTransferEntityType("contacts")).transferEntityType
    ).toBe("contacts");

    expect(
      reducer(undefined, setTransferEntityType("all")).transferEntityType
    ).toBe("all");

    expect(
      reducer(undefined, setTransferEntityType("leads")).transferEntityType
    ).toBe("leads");

    expect(
      reducer(undefined, setTransferEntityType("deals")).transferEntityType
    ).toBe("deals");
  });
});

describe("check transferType manipulations", function () {
  test("transferType proper values can be set", function () {
    expect(
      reducer(undefined, setTransferType("responsible")).transferType
    ).toBe("responsible");

    expect(reducer(undefined, setTransferType("country")).transferType).toBe(
      "country"
    );
  });
});
