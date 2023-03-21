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
  const elements = screen.getAllByRole("button");
  elements.forEach(({ innerHTML }, i) => {
    expect(innerHTML).toBe(labels[i]);
  });
});
