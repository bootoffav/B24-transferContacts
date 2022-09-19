import { useAppSelector, useAppDispatch } from "app/hooks";
import {
  setViewMode,
  viewModeAll,
  viewModeNoCountries,
  viewModeWithLinkedIn,
} from "features/List/ListSlice";

export default function CompanyFilter() {
  const viewMode = useAppSelector(({ list }) => list.viewMode);
  const dispatch = useAppDispatch();

  return (
    <div className="buttons has-addons">
      <button
        className={`button is-light is-link ${
          viewMode === viewModeAll ? "is-active" : ""
        }`}
        onClick={() => {
          dispatch(setViewMode(viewModeAll));
        }}
      >
        All
      </button>
      <button
        className={`button is-light is-link ${
          viewMode === viewModeNoCountries ? "is-active" : ""
        }`}
        onClick={() => {
          dispatch(setViewMode(viewModeNoCountries));
        }}
      >
        No countries
      </button>
      <button
        className={`button is-light is-link ${
          viewMode === viewModeWithLinkedIn ? "is-active" : ""
        }`}
        onClick={() => {
          dispatch(setViewMode(viewModeWithLinkedIn));
        }}
      >
        With LinkedIn
      </button>
    </div>
  );
}
