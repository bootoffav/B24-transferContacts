import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { CommonState, setChosenId } from "../../app/commonSlice";
import { fetchUsers, fetchCountries } from "../../app/endpoint";
import { Country, User } from "../../types";

type EntitySelectorProps = {
  selectType: CommonState["selectType"];
};

function EntitySelector({ selectType }: EntitySelectorProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchCountries());
  }, [dispatch]);

  const selectOptions = useAppSelector((state) => state.common[selectType]);

  const mapUsers = () =>
    (selectOptions as User[]).map(({ NAME, LAST_NAME, ID, ACTIVE }) => (
      <option key={ID} value={ID}>
        {`${NAME} ${LAST_NAME} ${ACTIVE ? "" : " - dismissed"}`}
      </option>
    ));

  const mapCountries = () =>
    (selectOptions as Country[]).map(({ value, ID }) => (
      <option key={ID} value={ID}>
        {value}
      </option>
    ));

  return (
    <div
      className={`select is-fullwidth ${
        selectOptions.length ? "" : "is-loading"
      }`}
    >
      <select
        onChange={({ target }) => dispatch(setChosenId(Number(target.value)))}
      >
        {selectType === "countries" ? mapCountries() : mapUsers()}
      </select>
    </div>
  );
}

export default EntitySelector;
