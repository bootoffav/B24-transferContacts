import { Country } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import { transferContacts } from "../../app/endpoint";
import { setStage } from "../../app/commonSlice";

const InfoBlock = () => {
  const companies = useSelector<unknown, Country[]>(
    (state: any) => state.company.companiesWithContacts
  );
  const stage = useSelector((state: any) => state.common.stage);
  const differentResponsibles = useSelector(
    (state: any) => state.company.differentResponsibles
  );
  const dispatch = useDispatch();

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
    case "gettingCompanies":
      output = (
        <>
          <span className="p-2">Getting data</span>
          <ClipLoader loading={true} />
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
          <button
            className="button ml-2 is-success is-small is-light"
            onClick={async () => {
              dispatch(setStage("transferring"));
              await transferContacts(differentResponsibles);
              dispatch(setStage("transferred"));
            }}
          >
            FIX IT BY TRANSFERRING CONTACTS!
          </button>
        </>
      );
      break;
    case "transferring":
      output = (
        <>
          <span className="p-2">
            Transferring {differentResponsiblesAmount()} contacts to
            responsibles of their companies
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
