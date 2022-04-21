import { useSelector, useDispatch } from "react-redux";
import {
  add,
  setChosenCountryId,
} from "../countrySelector/countrySelectorSlice";
import type { Country } from "../../types";
import { useEffect } from "react";
import { fetchCountryList } from "../../app/endpoint";

function CountrySelector() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const countries = await fetchCountryList();
      dispatch(add(countries));
    })();
  }, [dispatch]);

  const countries = useSelector<unknown, Country[]>(
    (state: any) => state.countrySelector.countries
  );

  return (
    <div className="control has-icons-left is-disabled">
      <div className={`select ${countries.length ? "" : "is-loading"}`}>
        <select
          onChange={({ target }) => {
            dispatch(setChosenCountryId(target.value));
          }}
        >
          {countries.map(({ value, id }) => {
            return (
              <option key={id} value={id}>
                {value}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default CountrySelector;
