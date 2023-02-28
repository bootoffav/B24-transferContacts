import { useAppDispatch, useAppSelector } from "app/hooks";
import { Stage, setStage } from "app/commonSlice";
import LinkedInOnly from "features/LinkedInOnly/LinkedInOnly";
import InfoBlock from "features/InfoBlock/InfoBlock";
import EntitySelector from "features/EntitySelector/EntitySelector";
import GetCompanies from "features/GetCompanies/GetCompanies";
import "../styles.scss";
import { generateExcelFileStructureLinkedInOnly } from "features/Export/ExcelGeneration";
import XLSX from "xlsx-js-style";
import { useEffect } from "react";
import { companySelector } from "features/List/companySelector";
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

  return (
    <div className="container is-fluid">
      <header className="columns is-flex is-align-items-center is-justify-content-center">
        {[Stage.scanFinished, Stage.cancelling, Stage.gettingData].includes(
          stage
        ) && <LinkSwitcher />}
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
  );
}
