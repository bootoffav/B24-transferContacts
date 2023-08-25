import { useAppSelector } from "app/hooks";

export function BulkCountryChange() {
  const { companyCountryList } = useAppSelector(({ common }) => common);

  return (
    <div className="column is-flex is-align-items-center">
      <label htmlFor="bulkCountryChange">Bulk country change:</label>
      <div className="select px-1" id="bulkCountryChange">
        <select>
          {companyCountryList.map(({ ID, value }) => {
            return (
              <option key={ID} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>
      <button className="button is-info" disabled>
        Apply
      </button>
    </div>
  );
}
