import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { transferCountry } from "../../app/endpoint";
import { setStage, setTransferredAmount, Stage } from "../../app/commonSlice";
import { setContactsNoCountries } from "../../app/companySlice";
import TransferButton from "features/TransferButton/TransferButton";
import { getAmountToTransfer } from "app/helpers";
import { setTransferType } from "features/TransferButton/TransferButtonSlice";
import { setViewMode, ViewMode } from "features/List/listSlice";

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
          Found{" "}
          <Link to="" onClick={() => dispatch(setViewMode(ViewMode.all))}>
            {companies.length}
          </Link>{" "}
          companies,{" "}
          <Link to="" onClick={() => dispatch(setViewMode(ViewMode.diffs))}>
            {getAmountToTransfer(differentResponsibles, "responsible")}{" "}
          </Link>
          diff. responsibles for{" "}
          <Link
            to=""
            onClick={() => dispatch(setViewMode(ViewMode.custom, "CONTACTS"))}
          >
            contacts
          </Link>
          ,{" "}
          <Link
            to=""
            onClick={() => dispatch(setViewMode(ViewMode.custom, "LEADS"))}
          >
            leads
          </Link>{" "}
          &{" "}
          <Link
            to=""
            onClick={() => dispatch(setViewMode(ViewMode.custom, "DEALS"))}
          >
            deals
          </Link>
        </p>
        <TransferButton />
      </div>
      <div>
        <p>
          <Link
            to=""
            onClick={() => dispatch(setViewMode(ViewMode.noCountries))}
          >
            {noCountriesAmount()}
          </Link>{" "}
          contacts have not set up country
        </p>
        <button
          className="button ml-2 is-success is-small is-light"
          onClick={async () => {
            dispatch(setStage(Stage.transferring));
            dispatch(setTransferType("country"));
            dispatch(setTransferredAmount(0));
            // eslint-disable-next-line
            for await (let _ of transferCountry(noCountry)) {
              dispatch(setTransferredAmount(1));
            }
            dispatch(setStage(Stage.transferred));
            dispatch(setTransferredAmount(0));
            dispatch(setContactsNoCountries([]));
          }}
        >
          APPLY COMPANY COUNTRY TO THEM
        </button>
      </div>
    </div>
  );
}
