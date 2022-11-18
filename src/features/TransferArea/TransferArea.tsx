import { useAppDispatch, useAppSelector } from "app/hooks";
import { transferCountry } from "../../app/endpoint";
import { setStage, Stage, setTransferredAmount } from "../../app/commonSlice";
import { setContactsNoCountries } from "../../app/companySlice";
import TransferButton from "features/TransferButton/TransferButton";
import { differentResponsiblesAmount, noCountriesAmount } from "app/helpers";

export default function TransferArea() {
  const dispatch = useAppDispatch();
  const { companies, differentResponsibles, noCountry } = useAppSelector(
    ({ company }) => ({
      companies: company.companies,
      differentResponsibles: company.differentResponsibles,
      noCountry: company.contactsNoCountries,
    })
  );

  async function transferCountryButtonHandler() {
    dispatch(setStage(Stage.transferring));
    dispatch(setTransferredAmount(0));
    const transferCountryIter = transferCountry(noCountry);

    while (true) {
      const { done } = await transferCountryIter.next();
      if (done) break;
      dispatch(setTransferredAmount(1));
    }

    dispatch(setStage(Stage.transferred));
    dispatch(setContactsNoCountries([]));
  }

  return (
    <div className="is-flex is-justify-content-space-around">
      {/* block 1 */}
      <div>
        <p>
          Found {companies.length} companies,{" "}
          {differentResponsiblesAmount(differentResponsibles)} diff.
          responsibles for contacts, leads & deals
        </p>
        <TransferButton />
      </div>

      {/* block 2 */}
      <div>
        <p>
          {noCountriesAmount(noCountry)} contacts have not set up its country or
          set NONE
        </p>
        <button
          className="button ml-2 is-success is-small is-light"
          onClick={transferCountryButtonHandler}
        >
          APPLY COMPANY COUNTRY TO THEM
        </button>
      </div>
    </div>
  );
}
