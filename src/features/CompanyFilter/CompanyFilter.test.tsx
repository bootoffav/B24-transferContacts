import CompanyFilter from "./CompanyFilter";
import { createRoot } from "react-dom/client";

it("renders CompanyFilter without crashing", () => {
  createRoot(document.createElement("div")).render(<CompanyFilter />);
});
