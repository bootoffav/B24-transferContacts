// @ts-nocheck
import { setChosenId, setSelectType } from "app/commonSlice";
import { setCheckboxOption } from "features/Options/OptionsSlice";
import { fetchCountries, fetchDepartments, fetchUsers } from "app/endpoint";
import {
  getEntityTitle,
  getAmountToTransfer,
  getOptionalEntitiesToFetch,
} from "app/helpers";
import { store } from "app/store";
import { differentResponsibles } from "tests/mocks/differentResponsibles";

const { getState, dispatch } = store;
jest.setTimeout(10000);

describe("check getAmountToTransfer", function () {
  // test("correctly counts contacts has no countries", function () {
  //   const contactsHasNoCountries1 = {
  //     583: [27300],
  //   };
  //   expect(getAmountToTransfer(contactsHasNoCountries1, "country")).toBe(1);

  //   const contactsHasNoCountries2 = {
  //     583: [27300, 11223, 40222, 45888, 10021],
  //   };
  //   expect(getAmountToTransfer(contactsHasNoCountries2, "country")).toBe(5);

  //   const contactsHasNoCountries3 = {
  //     583: [],
  //   };
  //   expect(getAmountToTransfer(contactsHasNoCountries3, "country")).toBe(0);

  //   const contactsHasNoCountries4 = {};
  //   expect(getAmountToTransfer(contactsHasNoCountries4, "country")).toBe(0);
  // });
  describe("counts different responsibles", function () {
    test("counts different responbles for contacts", function () {
      expect(
        getAmountToTransfer(differentResponsibles, "responsible", "contacts")
      ).toBe(120);
    });

    test("counts different responsibles for deals", function () {
      expect(
        getAmountToTransfer(differentResponsibles, "responsible", "deals")
      ).toBe(13);
    });

    test("count different responsibles for leads", function () {
      expect(
        getAmountToTransfer(differentResponsibles, "responsible", "leads")
      ).toBe(16);
    });

    test("count different responsibles for all", function () {
      const result = getAmountToTransfer(
        differentResponsibles,
        "responsible",
        "all"
      );
      expect(result).toBe(149);
    });
  });

  test("correctly counts different responsibles", function () {});
});

describe("check getOptionalEntitiesToFetch()", function () {
  test("gets correct set of entities to fetch no modification in store", function () {
    const entities = getOptionalEntitiesToFetch();

    expect(entities.length).toBe(2);
    expect(entities).toEqual(expect.arrayContaining(["deal", "lead"]));
  });

  test("gets optionalEntities leads excluded", function () {
    dispatch(setCheckboxOption("includeLeads", false));
    const entities = getOptionalEntitiesToFetch();

    expect(entities.length).toBe(1);
    expect(entities).toEqual(expect.arrayContaining(["deal"]));
    expect(entities).not.toEqual(expect.arrayContaining(["lead"]));
  });

  test("gets optionalEntities deals excluded", function () {
    dispatch(setCheckboxOption("includeDeals", false));
    const entities = getOptionalEntitiesToFetch();

    expect(entities.length).toBe(0);
    expect(entities).not.toEqual(expect.arrayContaining(["deal"]));
  });
});
