import { findCompaniesByUser } from "./Summary";
import { companies } from "tests/mocks/companies";
import { store } from "app/store";
import { setCheckboxOption } from "features/Options/OptionsSlice";
import { render, screen } from "@testing-library/react";
import storeConnected from "tests/storeConnected";
import Summary from "./Summary";

describe("tests Department summary functionality", function () {
  test("findCompaniesByUser", function () {
    let companiesByUser = findCompaniesByUser(companies, 3728);
    expect(companiesByUser.length).toBe(59);
    companiesByUser = findCompaniesByUser(companies, 5196);
    expect(companiesByUser.length).toBe(1);
  });

  describe("properly show/hide (diff. responsible for leads, diff. responsible for deals) header columns", function () {
    // leads shown
    test("diff. responsible for leads shown", function () {
      store.dispatch(
        setCheckboxOption({ what: "includeLeads", newValue: true })
      );
      render(storeConnected(<Summary />));

      expect(screen.getByTestId("thead")).toHaveTextContent(
        "diff. responsible for leads"
      );
    });

    // leads hidden
    test("diff. responsible for leads hidden", function () {
      store.dispatch(
        setCheckboxOption({ what: "includeLeads", newValue: false })
      );
      render(storeConnected(<Summary />));
      expect(screen.getByTestId("thead")).not.toHaveTextContent(
        "diff. responsible for leads"
      );
    });

    //deals shown
    test("diff. responsible for deals shown", function () {
      store.dispatch(
        setCheckboxOption({ what: "includeDeals", newValue: true })
      );
      render(storeConnected(<Summary />));
      expect(screen.getByTestId("thead")).toHaveTextContent(
        "diff. responsible for deals"
      );
    });

    //deals hidden
    test("diff. responsible for deals hidden", function () {
      store.dispatch(
        setCheckboxOption({ what: "includeDeals", newValue: false })
      );
      render(storeConnected(<Summary />));
      expect(screen.getByTestId("thead")).not.toHaveTextContent(
        "diff. responsible for deals"
      );
    });
  });
});
