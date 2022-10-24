import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { setChosenId } from "../../app/commonSlice";
import {
  fetchUsers,
  fetchCountries,
  fetchDepartments,
} from "../../app/endpoint";
import { optionSelector } from "./optionSelector";

function EntitySelector() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCountries());
    (async () => {
      await dispatch(fetchUsers());
      dispatch(fetchDepartments());
    })();
  }, [dispatch]);

  const selectOptions = useAppSelector(optionSelector);
  const chosenId = useAppSelector(({ common }) => common.chosenId);

  return (
    <div
      className={`select is-fullwidth ${
        selectOptions.length ? "" : "is-loading"
      }`}
    >
      <select
        value={chosenId?.toString()}
        onChange={({ target }) => {
          const ids = target.value.split(",").map((strId) => +strId);
          dispatch(setChosenId(ids));
        }}
      >
        {selectOptions}
      </select>
    </div>
  );
}

export default EntitySelector;
