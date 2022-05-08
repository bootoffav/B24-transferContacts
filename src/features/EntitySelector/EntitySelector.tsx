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
    (selectOptions as Country[]).map(({ value, id }) => (
      <option key={id} value={id}>
        {value}
      </option>
    ));

  return (
    <div className="control is-disabled">
      <div className={`select ${selectOptions.length ? "" : "is-loading"}`}>
        <select onChange={({ target }) => dispatch(setChosenId(target.value))}>
          {selectType === "countries" ? mapCountries() : mapUsers()}
        </select>
      </div>
    </div>
  );
}

export default EntitySelector;
