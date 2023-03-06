import { companyNoCountryView } from "./companySelector";
import { companies } from "tests/mocks/companies";

it("filter companies which has a contact without a country assigned", () => {
  const res = companyNoCountryView(companies);
  expect(res.length).toBe(4);
});
