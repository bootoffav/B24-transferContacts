import { useAppSelector, useAppDispatch } from "app/hooks";
import {
  setViewMode,
  viewModeAll,
  viewModeNoCountries,
  viewModeWithLinkedIn,
  viewModeContactsCountryNone,
  viewModeDiffs,
  viewModeCustom,
  ListSliceState,
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
      label: "No country (company)",
      viewMode: viewModeNoCountries,
    },
    {
      label: "No country (contact)",
      viewMode: viewModeContactsCountryNone,
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
            dispatch(setViewMode({ viewMode }));
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
