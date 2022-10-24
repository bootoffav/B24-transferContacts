import { render, screen } from "@testing-library/react";
import EntitySelector from "./EntitySelector";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { fetchCountries } from "app/endpoint";

xtest("loads and check all options in place", async () => {
  render(
    <Provider store={store}>
      <EntitySelector />
    </Provider>
  );

  await store.dispatch(fetchCountries());
  const countries = ["Russia", "Australia", "Austria"].sort();
  // const options = screen.getAllByRole("option");
  // expect(options.length).toBe(OPTION_TEXT.length);
  // expect(options.map((option) => option.innerHTML).sort()).toEqual(OPTION_TEXT);
});
