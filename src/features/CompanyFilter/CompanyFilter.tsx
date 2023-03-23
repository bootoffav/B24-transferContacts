import { useAppSelector, useAppDispatch } from "app/hooks";
import { companySelector } from "features/List/companySelector";
import { setViewMode, ListSliceState, ViewMode } from "features/List/listSlice";

export default function CompanyFilter() {
  const { viewMode: storeViewMode } = useAppSelector(({ list }) => list);
  const dispatch = useAppDispatch();

  const filterOptions: {
    label: string;
    viewMode: ListSliceState["viewMode"];
  }[] = [
    {
      label: "All",
      viewMode: ViewMode.all,
    },
    {
      label: "Diffs",
      viewMode: ViewMode.diffs,
    },
    {
      label: "No country (any contact)",
      viewMode: ViewMode.noCountries,
    },
    {
      label: "No emails",
      viewMode: ViewMode.noEmail,
    },
    {
      label: "With LinkedIn",
      viewMode: ViewMode.withLinkedIn,
    },
    {
      label: "Custom",
      viewMode: ViewMode.custom,
    },
  ];

  return (
    <div className="column buttons has-addons">
      {filterOptions.map(({ viewMode, label }) => (
        <button
          disabled={label === "Custom" && storeViewMode !== ViewMode.custom}
          key={viewMode}
          className={`button is-light is-link${
            storeViewMode === viewMode ? " is-active" : ""
          }`}
          onClick={() => {
            dispatch(setViewMode(viewMode));
          }}
        >
          {![viewMode, storeViewMode].includes(ViewMode.custom) && (
            <Badge viewMode={viewMode} />
          )}
          {label}
        </button>
      ))}
    </div>
  );
}

const Badge = ({ viewMode }: { viewMode: ListSliceState["viewMode"] }) => {
  const amount = useAppSelector(
    (state) => companySelector(state, viewMode).length
  );
  return <span className="badge is-top is-warning">{amount}</span>;
};
