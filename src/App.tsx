import { useAppDispatch, useAppSelector } from "app/hooks";
import { setSelectType, setChosenId, Stage } from "app/commonSlice";
import LinkedInOnly from "features/LinkedInOnly/LinkedInOnly";
import InfoBlock from "features/InfoBlock/InfoBlock";
import List from "features/List/List";
import { useAuth0 } from "@auth0/auth0-react";
import { CommonState } from "app/commonSlice";
import EntitySelector from "features/EntitySelector/EntitySelector";
import GetCompanies from "features/GetCompanies/GetCompanies";
import Export from "features/Export/Export";
import "./styles.scss";
import { ClipLoader } from "react-spinners";
import CompanyFilter from "features/CompanyFilter/CompanyFilter";
import { generateExcelFileStructureLinkedInOnly } from "features/Export/ExcelGeneration";
import XLSX from "xlsx-js-style";
import { useEffect } from "react";
import { companySelector } from "features/List/CompanySelector";

export default function App() {
  const dispatch = useAppDispatch();
  const stage = useAppSelector(({ common }) => common.stage);
  const companies = useAppSelector(companySelector);

  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (stage === Stage.linkedInOnlyScanFinished) {
      const { filename, content } = generateExcelFileStructureLinkedInOnly(
        companies,
        ""
      );
      XLSX.writeFile(content, filename);
    }
  }, [stage, companies]);

  if (isLoading) {
    return (
      <div className="centered is-flex is-justify-content-center">
        <ClipLoader loading={true} size={300} />
      </div>
    );
  }

  return isAuthenticated ? (
    <div className="m-4">
      <header className="columns is-flex is-align-items-center is-justify-content-center">
        <div className="column is-2">
          <span className="is-pulled-right">Choose:</span>
        </div>
        <div className="column is-2">
          <div className="select is-fullwidth">
            <select
              defaultValue="manager"
              onChange={({ target: { value } }) => {
                dispatch(setSelectType(value as CommonState["selectType"]));
                dispatch(setChosenId());
              }}
            >
              <option value="users">Manager</option>
              <option value="countries">Country</option>
            </select>
          </div>
        </div>
        <div className="column is-2">
          <EntitySelector />
        </div>
        <div className="column is-1 has-text-centered">
          <LinkedInOnly />
        </div>
        <div className="column is-2">
          <GetCompanies />
        </div>
      </header>
      <InfoBlock />
      {stage === Stage.linkedInOnlyScanFinished}
      {(stage === Stage.scanFinished && (
        <>
          <div className="columns">
            <CompanyFilter />
            <Export />
          </div>
          <div className="columns">
            <List />
          </div>
        </>
      )) ||
        ""}
    </div>
  ) : (
    <>{loginWithRedirect()}</>
  );
}
