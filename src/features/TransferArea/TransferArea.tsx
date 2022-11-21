import { useAppDispatch, useAppSelector } from "app/hooks";
import { transferCountry } from "../../app/endpoint";
import { setStage, Stage } from "../../app/commonSlice";
import { setContactsNoCountries } from "../../app/companySlice";
import TransferButton from "features/TransferButton/TransferButton";
import { differentResponsiblesAmount } from "app/helpers";

export default function TransferArea() {
  const dispatch = useAppDispatch();
  const { companies, differentResponsibles, noCountry } = useAppSelector(
    ({ company }) => ({
      companies: company.companies,
      differentResponsibles: company.differentResponsibles,
      noCountry: company.contactsNoCountries,
    })
  );

  function noCountriesAmount() {
    return Object.values(noCountry).reduce((acc, set) => acc + set.length, 0);
  }

  return (
    <div className="is-flex is-justify-content-space-around">
      <div>
        <p>
          Found {companies.length} companies,{" "}
          {differentResponsiblesAmount(differentResponsibles)} diff.
          responsibles for contacts, leads & deals
        </p>
        <TransferButton />
      </div>
      <div>
        <p>
          {noCountriesAmount()} contacts have not set up its country or set NONE
        </p>
        <button
          className="button ml-2 is-success is-small is-light"
          onClick={async () => {
            dispatch(setStage(Stage.transferring));
            await transferCountry(noCountry);
            dispatch(setStage(Stage.transferred));
            dispatch(setContactsNoCountries([]));
          }}
        >
          APPLY COMPANY COUNTRY TO THEM
        </button>
      </div>
    </div>
  );
}
