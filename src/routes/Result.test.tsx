import { screen, render } from "@testing-library/react";
import Result from "./Result";
import storeConnected from "tests/storeConnected";
import { store } from "app/store";
import { Stage, setStage } from "app/commonSlice";
import { setCheckboxOption } from "features/Options/OptionsSlice";
import { setCompanies } from "app/companySlice";
import { companies } from "tests/mocks/companies";

const component = storeConnected(<Result />);
const { dispatch, getState } = store;

it("should render without crashing", () => {
  render(component);
});

it("should render new request block", () => {
  dispatch(setCompanies(companies));
  dispatch(setStage(Stage.scanFinished));
  dispatch(setCheckboxOption("includeDeals", false));
  dispatch(setCheckboxOption("includeLeads", true));
  render(storeConnected(<Result />));
  // screen.getByText("Request again!");
});
