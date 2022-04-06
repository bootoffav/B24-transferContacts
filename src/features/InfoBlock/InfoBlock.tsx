import { Country } from "../../types";
import { useSelector } from "react-redux";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";

const InfoBlock = () => {
  const companies = useSelector<unknown, Country[]>(
    (state: any) => state.company.companiesWithContacts
  );
  const stage = useSelector((state: any) => state.common.stage);
  let output: string | JSX.Element = "";

  switch (stage) {
    case "initial":
      output = "Choose country, click Get companies to make a list";
      break;
    case "gettingUsers":
      output = (
        <>
          Getting users
          <ClipLoader loading={true} />
        </>
      );
      break;
    case "scanFinished":
      output = `Found ${companies.length} companies`;
      break;
    case "gettingCompanies":
      output = (
        <>
          Getting companies
          <ClipLoader loading={true} />
        </>
      );
  }

  return (
    <div className="columns">
      <div className="column has-text-centered is-size-4">{output}</div>
    </div>
  );
};

export default InfoBlock;
