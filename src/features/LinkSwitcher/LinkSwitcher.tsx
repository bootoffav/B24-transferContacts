import { Link, useLocation } from "react-router-dom";

export default function LinkSwitcher() {
  const { pathname } = useLocation();
  const { to, label } =
    pathname === "/"
      ? {
          to: "summary",
          label: "Summary",
        }
      : {
          to: "/",
          label: "Main",
        };

  return (
    <div className="column">
      <Link to={to}>{label}</Link>
    </div>
  );
}
