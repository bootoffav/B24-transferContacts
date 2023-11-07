import { useAppSelector } from "app/hooks";
import { companySelector } from "features/List/companySelector";
import { changeCompanyCountry } from "app/endpoint";
import { useState } from "react";

export function BulkCountryChange() {
  const { companyCountryList } = useAppSelector(({ common }) => common);
  const companies = useAppSelector(companySelector);
  const [countryId, setCountryId] = useState<string>();
  const [processing, setProcessing] = useState(false);
  const [finished, setFinished] = useState(false);

  async function bulkUpdate(e: any) {
    setProcessing(true);
    try {
      for (const { ID } of companies) {
        countryId && changeCompanyCountry(ID, countryId);
        await new Promise((res) => setTimeout(res, 800));
      }
      setFinished(true);
    } catch {}
    setProcessing(false);
  }

  return (
    <div className="column is-flex is-align-items-center">
      <label htmlFor="bulkCountryChange">Bulk country change:</label>
      <div className="select px-1" id="bulkCountryChange">
        <select onChange={({ target }) => setCountryId(target.value)}>
          {companyCountryList.map(({ ID, value }) => (
            <option key={ID} value={ID}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <button
        className={`button is-info${processing ? " is-loading" : ""}`}
        onClick={bulkUpdate}
        disabled={processing}
      >
        Apply
      </button>
      {finished && (
        <p className="p-2 is-uppercase has-text-bold has-text-info">
          Countries applied
        </p>
      )}
    </div>
  );
}
