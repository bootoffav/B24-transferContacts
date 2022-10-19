import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import EntityTypeSelector from "./EntityTypeSelector";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../../app/store";

test("loads and check all options in place", async () => {
  render(
    <Provider store={store}>
      <EntityTypeSelector />
    </Provider>
  );

  const OPTION_TEXT = ["Manager", "Country", "Departments"].sort();
  const options = screen.getAllByRole("option");
  expect(options.length).toBe(OPTION_TEXT.length);
  expect(options.map((option) => option.innerHTML).sort()).toEqual(OPTION_TEXT);
});
