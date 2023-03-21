import { render, screen, waitFor } from "@testing-library/react";
import EntitySelector from "./EntitySelector";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { fetchCountries, fetchDepartments, fetchUsers } from "app/endpoint";
import { setSelectType } from "app/commonSlice";

jest.setTimeout(15000);

describe("loads and check all options in place", function () {
  beforeAll(async function () {
    await store.dispatch(fetchCountries());
    await store.dispatch(fetchUsers());
    await store.dispatch(fetchDepartments());
  });
  beforeEach(() => {
    render(
      <Provider store={store}>
        <EntitySelector />
      </Provider>
    );
  });

  test("checks user's select", async function () {
    await waitFor(() => store.dispatch(setSelectType("users")));
    const options = screen.getAllByRole("option");
    expect(options.map((opt) => opt.innerHTML.trim())).toEqual(
      expect.arrayContaining([
        "Aleksei Butov",
        "Igor Stoliarov",
        "Vitaly Aliev",
      ])
    );
  });

  test("checks department's select", async function () {
    await waitFor(() => store.dispatch(setSelectType("departments")));
    const options = screen.getAllByRole("option");
    expect(options.map((opt) => opt.innerHTML.trim())).toEqual(
      expect.arrayContaining(["IT", "XM Textiles"])
    );
  });

  test("check countries' select", async function () {
    await waitFor(() => store.dispatch(setSelectType("companyCountryList")));
    const options = screen.getAllByRole("option");
    expect(options.map((opt) => opt.innerHTML.trim())).toEqual(
      expect.arrayContaining(["Albania", "Comoros", "Italy"])
    );
  });
});
