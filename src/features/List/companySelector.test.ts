import { companyNoCountryView, companySelector } from "./companySelector";
import { companies } from "tests/mocks/companies";
import { setCompanies } from "app/companySlice";
import { setViewMode, viewModeNoEmail } from "./listSlice";
import { store } from "app/store";

const { dispatch, getState } = store;
it("filter companies which has a contact without a country assigned", () => {
  const amountOfCompaniesWithContactsNoCompanies =
    companyNoCountryView(companies).length;
  expect(amountOfCompaniesWithContactsNoCompanies).toBe(4);
});

describe("companySelector", () => {
  it("companies has no email", () => {
    dispatch(setCompanies(companies));
    dispatch(setViewMode(viewModeNoEmail));

    const amountOfCompaniesNoEmail = companySelector(getState()).length;
    expect(amountOfCompaniesNoEmail).toBe(5);
  });
});
