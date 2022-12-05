import DepartmentSummary, { findCompaniesByUser } from "./DepartmentSummary";
import { companies } from "tests/mocks/companies";

describe("tests Department summary functionality", function () {
  test("findCompaniesByUser", function () {
    let companiesByUser = findCompaniesByUser(companies, 3728);
    expect(companiesByUser.length).toBe(59);
    companiesByUser = findCompaniesByUser(companies, 5196);
    expect(companiesByUser.length).toBe(1);
  });
});
