import { setChosenId, setSelectType } from "app/commonSlice";
import { fetchCountries, fetchDepartments, fetchUsers } from "app/endpoint";
import { getEntityTitle } from "app/helpers";
import { store } from "../../app/store";

jest.setTimeout(10000);

describe("it finds correct entity", function () {
  test("find correct user name", async function () {
    await store.dispatch(fetchUsers());
    store.dispatch(setSelectType("users"));

    store.dispatch(setChosenId([5]));
    expect(getEntityTitle()).toBe("Aleksei Butov");

    store.dispatch(setChosenId([7]));
    expect(getEntityTitle()).toBe("Igor Stoliarov");
  });

  test("find correct country", async function () {
    await store.dispatch(fetchCountries());
    store.dispatch(setSelectType("companyCountryList"));

    store.dispatch(setChosenId([875]));
    expect(getEntityTitle()).toBe("Albania");

    store.dispatch(setChosenId([1023]));
    expect(getEntityTitle()).toBe("Comoros");
  });

  test("find correct department", async function () {
    await store.dispatch(fetchDepartments());
    store.dispatch(setSelectType("departments"));

    store.dispatch(setChosenId([314, 181, 4416, 5126]));
    expect(getEntityTitle()).toBe("XM Textiles Spain");

    store.dispatch(setChosenId([5]));
    expect(getEntityTitle()).toBe("IT department");
  });
});
