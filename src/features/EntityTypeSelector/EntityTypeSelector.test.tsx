import { render, screen } from "@testing-library/react";
import EntityTypeSelector, {
  OPTION_TEXT_MAP,
  renderOptions,
} from "./EntityTypeSelector";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import { selectType } from "app/commonSlice";

test("loads and check all options in place", async () => {
  render(
    <Provider store={store}>
      <EntityTypeSelector />
    </Provider>
  );

  expect(screen.getAllByRole("option").length).toBe(selectType.length);

  for (const type of selectType) {
    const option = screen.getByTestId(type);
    expect(option).toHaveTextContent(OPTION_TEXT_MAP.get(type)!);
  }
});
