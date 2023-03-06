import companiesByUser from "./companiesByUser";
import { companies } from "tests/mocks/companies";

test("gets companiesByUser", function () {
  let userCompanies = companiesByUser(companies, 3728);
  expect(userCompanies.length).toBe(59);
  userCompanies = companiesByUser(companies, 5196);
  expect(userCompanies.length).toBe(1);
});
