import { store } from "app/store";
import { setCheckboxOption } from "features/Options/OptionsSlice";
import { render, screen } from "@testing-library/react";
import storeConnected from "tests/storeConnected";
import Summary from "./Summary";

const { dispatch } = store;
describe("tests Department summary functionality", function () {
  describe("properly show/hide (diff. responsible for leads, diff. responsible for deals) header columns", function () {
    // leads shown
    test("diff. responsible for leads shown", function () {
      dispatch(setCheckboxOption("includeLeads", true));
      render(storeConnected(<Summary />));

      expect(screen.getByTestId("thead")).toHaveTextContent(
        "diff. responsible for leads"
      );
    });

    // leads hidden
    test("diff. responsible for leads hidden", function () {
      dispatch(setCheckboxOption("includeLeads", false));
      render(storeConnected(<Summary />));
      expect(screen.getByTestId("thead")).not.toHaveTextContent(
        "diff. responsible for leads"
      );
    });

    //deals shown
    test("diff. responsible for deals shown", function () {
      dispatch(setCheckboxOption("includeDeals", true));
      render(storeConnected(<Summary />));
      expect(screen.getByTestId("thead")).toHaveTextContent(
        "diff. responsible for deals"
      );
    });

    //deals hidden
    test("diff. responsible for deals hidden", function () {
      dispatch(setCheckboxOption("includeDeals", false));
      render(storeConnected(<Summary />));
      expect(screen.getByTestId("thead")).not.toHaveTextContent(
        "diff. responsible for deals"
      );
    });
  });
});
