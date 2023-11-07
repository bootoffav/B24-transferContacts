import { companiesHaveNoCountry, companySelector } from "./companySelector";
import { companies } from "tests/mocks/companies";
import { setCompanies } from "app/companySlice";
import { ViewMode, setViewMode } from "./listSlice";
import { store } from "app/store";

const { dispatch, getState } = store;
it("filter companies which does not have country or has a contact without country assigned", () => {
  const amountOfCompaniesWithContactsNoCountries =
    companiesHaveNoCountry(companies).length;
  expect(amountOfCompaniesWithContactsNoCountries).toBe(1);
});

describe("companySelector", () => {
  it("companies has no email", () => {
    dispatch(setCompanies(companies));
    dispatch(setViewMode(ViewMode.noEmail));

    const amountOfCompaniesNoEmail = companySelector(getState()).length;
    expect(amountOfCompaniesNoEmail).toBe(5);
  });
});
