import { useAppSelector, useAppDispatch } from "../../app/hooks";
import ClipLoader from "react-spinners/ClipLoader";
import { transferEntity, transferCountry } from "../../app/endpoint";
import { setStage, setTransferredAmount, Stage } from "../../app/commonSlice";
import { setContactsNoCountries } from "../../app/companySlice";

export default function InfoBlock() {
  const {
    companies,
    companiesTotalAmount,
    companiesProcessedAmount,
    differentResponsibles,
    transferredAmount,
    noCountry,
    stage,
  } = useAppSelector(({ common, company }) => ({
    companies: company.companies,
    companiesTotalAmount: company.totalAmount,
    companiesProcessedAmount: company.processedAmount,
    differentResponsibles: company.differentResponsibles,
    noCountry: company.contactsNoCountries,
    transferredAmount: common.transferredAmount,
    stage: common.stage,
  }));

  const dispatch = useAppDispatch();

  function noCountriesAmount() {
    return Object.values(noCountry).reduce((acc, set) => acc + set.length, 0);
  }

  function differentResponsiblesAmount() {
    let amount = 0;
    for (const responsible in differentResponsibles) {
      amount = Object.values(differentResponsibles[responsible]).reduce(
        (acc, set) => set.length + acc,
        0
      );
    }
    return amount;
  }

  let output: string | JSX.Element = "";

  switch (stage) {
    case Stage.initial:
      output = "Choose country or manager, click Get companies to make a list";
      break;
    case Stage.gettingData:
    case Stage.cancelling:
      output = (
        <>
          <span className="p-2">
            {stage === Stage.gettingData ? "Getting data" : "Cancelling"}
          </span>
          <ClipLoader loading={true} />
          <p className="p-2">
            Processing {companiesProcessedAmount} of {companiesTotalAmount}{" "}
            found companies
          </p>
        </>
      );
      break;
    case Stage.scanFinished:
      output = (
        <div className="is-flex is-justify-content-space-around">
          <div>
            <p>
              Found {companies.length} companies,{" "}
              {differentResponsiblesAmount()} diff. responsibles for contacts,
              leads & deals
            </p>
            {companies.length ? (
              <button
                className="button ml-2 is-success is-small is-light"
                onClick={async () => {
                  dispatch(setStage(Stage.transferring));
                  // eslint-disable-next-line
                  for await (let _ of transferEntity(differentResponsibles)) {
                    dispatch(setTransferredAmount(1));
                  }
                  dispatch(setStage(Stage.transferred));
                  dispatch(setTransferredAmount(0));
                }}
              >
                FIX THEM ALL AT ONCE!
              </button>
            ) : (
              ""
            )}
          </div>
          <div>
            <p>
              {noCountriesAmount()} contacts have not set up its country or set
              NONE
            </p>
            <button
              className="button ml-2 is-success is-small is-light"
              onClick={async () => {
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
      break;
    case Stage.linkedInOnlyScanFinished:
      output = "LinkedIn list ready";
      break;
    case Stage.transferring:
      output = (
        <>
          <span className="p-2">
            Transferring {transferredAmount} of {differentResponsiblesAmount()}{" "}
            contacts to responsibles of their companies.
            {}
          </span>
          <ClipLoader loading={true} />
        </>
      );
      break;
    case Stage.transferred:
      output = (
        <div className="notification is-warning">
          DONE, to check changes click GET COMPANIES again!
        </div>
      );
      break;
  }

  return (
    <div className="columns">
      <div className="column has-text-centered is-size-5">{output}</div>
    </div>
  );
}
