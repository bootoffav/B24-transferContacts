import { generateExcelFileStructureForTransfer } from "./ExcelGeneration";
import XLSX from "xlsx-js-style";
import { useAppSelector } from "app/hooks";
import { companySelector } from "features/List/CompanySelector";
import { getEntityTitle } from "app/helpers";

const Export = () => {
  const [chosenId, titleLookupArray, users] = useAppSelector(({ common }) => [
    common.chosenId,
    common[common.selectType],
    common.users,
  ]);
  const companies = useAppSelector(companySelector);

  return (
    <div className="column">
      <button
        className="button is-small is-info is-light is-pulled-right"
        onClick={() => {
          const { filename, content } = generateExcelFileStructureForTransfer(
            companies,
            getEntityTitle(titleLookupArray, chosenId as number),
            users
          );
          XLSX.writeFile(content, filename);
        }}
      >
        <span className="icon is-small">
          <i className="fas fa-file-download"></i>
        </span>
        <span>Export to Excel</span>
      </button>
    </div>
  );
};

export default Export;
