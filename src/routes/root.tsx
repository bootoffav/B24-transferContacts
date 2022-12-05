import { useAppDispatch, useAppSelector } from "app/hooks";
import { Stage, setStage } from "app/commonSlice";
import LinkedInOnly from "features/LinkedInOnly/LinkedInOnly";
import InfoBlock from "features/InfoBlock/InfoBlock";
import { useAuth0 } from "@auth0/auth0-react";
import EntitySelector from "features/EntitySelector/EntitySelector";
import GetCompanies from "features/GetCompanies/GetCompanies";
import "../styles.scss";
import { ClipLoader } from "react-spinners";
import { generateExcelFileStructureLinkedInOnly } from "features/Export/ExcelGeneration";
import XLSX from "xlsx-js-style";
import { useEffect } from "react";
import { companySelector } from "features/List/CompanySelector";
import { getEntityTitle } from "app/helpers";
import EntityTypeSelector from "features/EntityTypeSelector/EntityTypeSelector";
import ProgressNotifier from "features/ProgressNotifier/ProgressNotifier";
import Options from "features/Options/Options";
import { includeCheckboxes } from "features/Options/OptionsSlice";
import { Outlet } from "react-router";
import LinkSwitcher from "features/LinkSwitcher/LinkSwitcher";

export default function Root() {
  const dispatch = useAppDispatch();
  const stage = useAppSelector(({ common }) => common.stage);
  const companies = useAppSelector(companySelector);

  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (stage === Stage.linkedInOnlyScanFinished) {
      const { filename, content } = generateExcelFileStructureLinkedInOnly(
        companies,
        getEntityTitle()
      );
      XLSX.writeFile(content, filename);
      setTimeout(() => dispatch(setStage(Stage.initial)), 3000);
    }
  }, [stage, companies, dispatch]);

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
        {stage === Stage.scanFinished && <LinkSwitcher />}
        <div className="column is-2">
          <span className="is-pulled-right">Choose:</span>
        </div>
        <div className="column is-2">
          <EntityTypeSelector />
        </div>
        <div className="column is-2">
          <EntitySelector />
        </div>
        <div className="column is-1 has-text-centered">
          <LinkedInOnly />
        </div>
        <div className="column is-1 has-text-centered">
          {includeCheckboxes.map((type) => (
            <div key={type}>
              <Options type={type} />
            </div>
          ))}
        </div>
        <div className="column is-1">
          <GetCompanies />
        </div>
        <ProgressNotifier />
      </header>
      <InfoBlock />
      <Outlet />
    </div>
  ) : (
    <>{loginWithRedirect()}</>
  );
}
