import getContactsNoCountries from "app/contactsNoCountries";
import { companyCountryList } from "tests/mocks/companyCountryList";
import { contactCountryList } from "tests/mocks/contactCountryList";
import { companies } from "tests/mocks/companies";
import { store } from "app/store";
import { setCompanies, setContactsNoCountries } from "app/companySlice";
import { setCountryList } from "app/commonSlice";

const { dispatch, getState } = store;

it("getContactsNoCountries", () => {
  dispatch(setCompanies(companies));
  dispatch(setCountryList([companyCountryList, contactCountryList]));
  dispatch(setContactsNoCountries(getContactsNoCountries()[0]));
  const { contactsNoCountries } = getState().company;
  expect(contactsNoCountries).toMatchObject({
    "603": ["33060", "26976", "29526", "26324"],
  });
});
