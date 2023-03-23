import CompanyFilter from "./CompanyFilter";
import storeConnected from "tests/storeConnected";
import { render, screen } from "@testing-library/react";

const labels = [
  "All",
  "Diffs",
  "No country (any contact)",
  "No emails",
  "With LinkedIn",
  "Custom",
] as const;

it("rendering CompanyFilter: check buttons", () => {
  render(storeConnected(<CompanyFilter />));
  for (const label of labels) {
    if (label !== "Custom") {
      const el = screen.getByText(label);
      expect(el.innerHTML).toContain('<span class="badge is-top is-warning">');
    }
    expect(screen.getByText(label)).toHaveTextContent(label);
  }
});
