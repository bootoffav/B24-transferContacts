import { useAppSelector, useAppDispatch } from "app/hooks";
import { setViewMode } from "features/List/ListSlice";

export default function CompanyFilter() {
  const viewMode = useAppSelector(({ list }) => list.viewMode);
  const dispatch = useAppDispatch();

  return (
    <div className="buttons has-addons">
      <button
        className={`button is-light is-link ${
          viewMode === "all" ? "is-active" : ""
        }`}
        onClick={() => {
          dispatch(setViewMode("all"));
        }}
      >
        All
      </button>
      <button
        className={`button is-light is-link ${
          viewMode === "noCountries" ? "is-active" : ""
        }`}
        onClick={() => {
          dispatch(setViewMode("noCountries"));
        }}
      >
        No countries
      </button>
    </div>
  );
}
