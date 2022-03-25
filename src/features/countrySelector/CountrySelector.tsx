// import styles from "./CountrySelector.module.css";
import { useEffect, useState } from "react";
import { fetchCountryList } from "../../app/endpoint";
import type { Country } from "../../types";

function CountrySelector() {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    (async function () {
      const countries = await fetchCountryList();
      setCountries(countries);
    })();
  }, []);

  return (
    <div className="control has-icons-left is-disabled">
      <div className="select is-loading">
        <select>
          {countries.map(({ value, id }) => {
            return <option>{value}</option>;
          })}
        </select>
      </div>
    </div>
  );
}

export default CountrySelector;
