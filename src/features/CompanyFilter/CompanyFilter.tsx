import { useAppSelector, useAppDispatch } from "app/hooks";
import { companySelectorNoEmail } from "features/List/companySelector";
import {
  setViewMode,
  viewModeAll,
  viewModeNoCountries,
  viewModeWithLinkedIn,
  viewModeDiffs,
  viewModeCustom,
  ListSliceState,
  viewModeNoEmail,
} from "features/List/listSlice";

export default function CompanyFilter() {
  const { viewMode: storeViewMode } = useAppSelector(({ list }) => list);
  const dispatch = useAppDispatch();

  const filterOptions: {
    label: string;
    viewMode: ListSliceState["viewMode"];
  }[] = [
    {
      label: "All",
      viewMode: viewModeAll,
    },
    {
      label: "Diffs",
      viewMode: viewModeDiffs,
    },
    {
      label: "No country (any contact)",
      viewMode: viewModeNoCountries,
    },
    {
      label: "No emails",
      viewMode: viewModeNoEmail,
    },
    {
      label: "With LinkedIn",
      viewMode: viewModeWithLinkedIn,
    },
    {
      label: "Custom",
      viewMode: viewModeCustom,
    },
  ];

  return (
    <div className="column buttons has-addons">
      {filterOptions.map(({ viewMode, label }) => (
        <button
          disabled={label === "Custom" && storeViewMode !== "custom"}
          key={viewMode}
          className={`button is-light is-link${
            storeViewMode === viewMode ? " is-active" : ""
          }`}
          onClick={() => {
            dispatch(setViewMode(viewMode));
          }}
        >
          {label === "No emails" && <Badge />}
          {label}
        </button>
      ))}
    </div>
  );
}

const Badge = () => {
  const amount = useAppSelector(
    ({ company: { companies } }) => companySelectorNoEmail(companies).length
  );
  return <span className="badge is-top is-warning">{amount}</span>;
};
