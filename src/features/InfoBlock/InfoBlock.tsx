import { useAppSelector, useAppDispatch } from "../../app/hooks";
import ClipLoader from "react-spinners/ClipLoader";
import { transferEntity } from "../../app/endpoint";
import { setStage, setTransferredAmount } from "../../app/commonSlice";

const InfoBlock = () => {
  const {
    companies,
    companiesTotalAmount,
    companiesProcessedAmount,
    differentResponsibles,
    transferredAmount,
    stage,
  } = useAppSelector(({ common, company }) => ({
    companies: company.companiesWithRelatedEntities,
    companiesTotalAmount: company.totalAmount,
    companiesProcessedAmount: company.processedAmount,
    differentResponsibles: company.differentResponsibles,
    transferredAmount: common.transferredAmount,
    stage: common.stage,
  }));

  const dispatch = useAppDispatch();

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
    case "initial":
      output = "Choose country or manager, click Get companies to make a list";
      break;
    case "gettingData":
    case "cancelling":
      output = (
        <>
          <span className="p-2">
            {stage === "gettingData" ? "Getting data" : "Cancelling"}
          </span>
          <ClipLoader loading={true} />
          <p className="p-2">
            Processing {companiesProcessedAmount} of {companiesTotalAmount}{" "}
            found companies
          </p>
        </>
      );
      break;
    case "scanFinished":
      output = (
        <>
          <p>
            Found {companies.length} companies, {differentResponsiblesAmount()}{" "}
            different responsibles for contacts, leads & deals
          </p>
          {companies.length ? (
            <button
              className="button ml-2 is-success is-small is-light"
              onClick={async () => {
                dispatch(setStage("transferring"));
                // eslint-disable-next-line
                for await (let _ of transferEntity(differentResponsibles)) {
                  dispatch(setTransferredAmount(1));
                }
                dispatch(setStage("transferred"));
                dispatch(setTransferredAmount(0));
              }}
            >
              FIX THEM ALL AT ONCE!
            </button>
          ) : (
            ""
          )}
        </>
      );
      break;
    case "transferring":
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
    case "transferred":
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
};

export default InfoBlock;
