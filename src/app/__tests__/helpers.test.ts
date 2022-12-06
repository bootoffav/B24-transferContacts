// @ts-nocheck
import { setChosenId, setSelectType } from "app/commonSlice";
import { setCheckboxOption } from "features/Options/OptionsSlice";
import { fetchCountries, fetchDepartments, fetchUsers } from "app/endpoint";
import {
  getEntityTitle,
  getAmountToTransfer,
  getOptionalEntitiesToFetch,
} from "app/helpers";
import { store } from "../../app/store";
import { differentResponsibles } from "tests/mocks/differentResponsibles";

jest.setTimeout(10000);

// describe("it finds correct entity", function () {
//   test("find correct user name", async function () {
//     await store.dispatch(fetchUsers());
//     store.dispatch(setSelectType("users"));

//     store.dispatch(setChosenId([5]));
//     expect(getEntityTitle()).toBe("Aleksei Butov");

//     store.dispatch(setChosenId([7]));
//     expect(getEntityTitle()).toBe("Igor Stoliarov");
//   });

//   test("find correct country", async function () {
//     await store.dispatch(fetchCountries());
//     store.dispatch(setSelectType("companyCountryList"));

//     store.dispatch(setChosenId([875]));
//     expect(getEntityTitle()).toBe("Albania");

//     store.dispatch(setChosenId([1023]));
//     expect(getEntityTitle()).toBe("Comoros");
//   });

//   test("find correct department", async function () {
//     await store.dispatch(fetchDepartments());
//     store.dispatch(setSelectType("departments"));

//     store.dispatch(setChosenId([314, 181, 4416, 5126]));
//     expect(getEntityTitle()).toBe("XM Textiles Spain");

//     store.dispatch(setChosenId([5]));
//     expect(getEntityTitle()).toBe("IT department");
//   });
// });

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
  describe("counts different respnsibles", function () {
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

    xtest("count different responsibles for all", function () {});
    expect(
      getAmountToTransfer(differentResponsibles, "responsible", "all")
    ).toBe(149);
    // expect(getAmountToTransfer(differentResponsibles, "responsible")).toBe(4);
  });

  test("correctly counts different responsibles", function () {});
});

describe("check getEntities function", function () {
  test("gets correct set of entities to fetch no modification in store", function () {
    expect(getOptionalEntitiesToFetch().length).toBe(2);
    expect(getOptionalEntitiesToFetch()).toEqual(
      expect.arrayContaining(["deal", "lead"])
    );
  });

  xtest("leads excluded", function () {
    store.dispatch(
      setCheckboxOption({ what: "includeLeads", newValue: false })
    );
    const entities = getOptionalEntitiesToFetch();
    expect(entities.length).toBe(1);
    expect(entities).toEqual(expect.arrayContaining(["deal"]));
    expect(entities).not.toEqual(expect.arrayContaining(["lead"]));
  });

  xtest("deals excluded", function () {
    store.dispatch(
      setCheckboxOption({ what: "includeDeals", newValue: false })
    );
    const entities = getOptionalEntitiesToFetch();
    expect(entities.length).toBe(0);
    expect(entities).not.toEqual(expect.arrayContaining(["deal"]));
  });
});
