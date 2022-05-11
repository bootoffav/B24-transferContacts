import { useAppSelector, useAppDispatch } from "../../app/hooks";
import ClipLoader from "react-spinners/ClipLoader";
import { transferContacts } from "../../app/endpoint";
import { setStage, setTransferredAmount } from "../../app/commonSlice";

const InfoBlock = () => {
  const companies = useAppSelector(
    (state) => state.company.companiesWithContacts
  );
  const companiesTotalAmount = useAppSelector(
    (state) => state.company.totalAmount
  );
  const companiesProcessedAmount = useAppSelector(
    (state) => state.company.processedAmount
  );

  const stage = useAppSelector((state) => state.common.stage);
  const differentResponsibles = useAppSelector(
    (state) => state.company.differentResponsibles
  );
  const transferredAmount = useAppSelector(
    (state) => state.common.transferredAmount
  );
  const dispatch = useAppDispatch();

  function differentResponsiblesAmount() {
    let amount = 0;
    for (const responsible in differentResponsibles) {
      amount += differentResponsibles[responsible].length;
    }
    return amount;
  }

  let output: string | JSX.Element = "";

  switch (stage) {
    case "initial":
      output = "Choose country, click Get companies to make a list";
      break;
    case "gettingData":
      output = (
        <>
          <span className="p-2">Getting data</span>
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
            different responsibles for contacts
          </p>
          {companies.length ? (
            <button
              className="button ml-2 is-success is-small is-light"
              onClick={async () => {
                dispatch(setStage("transferring"));
                // eslint-disable-next-line
                for await (let _ of transferContacts(differentResponsibles)) {
                  dispatch(setTransferredAmount(1));
                }
                dispatch(setStage("transferred"));
                dispatch(setTransferredAmount(0));
              }}
            >
              FIX IT BY TRANSFERRING CONTACTS!
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
      <div className="column has-text-centered is-size-4">{output}</div>
    </div>
  );
};

export default InfoBlock;
