import type { User, Country } from "../../types";
import { generateExcelFileStructureForTransfer } from "./ExcelGeneration";
import XLSX from "xlsx-js-style";
import { useAppSelector } from "app/hooks";
import { companySelector } from "features/List/CompanySelector";

const Export = () => {
  const [chosenId, titleLookupArray, users] = useAppSelector(({ common }) => [
    common.chosenId,
    common[common.selectType],
    common.users,
  ]);
  const companies = useAppSelector(companySelector);

  const getEntityTitle = (): string => {
    // @ts-ignore
    const foundEntity: User | Country | undefined = titleLookupArray.find(
      ({ ID }: User | Country) => Number(ID) === chosenId
    );
    if (foundEntity) {
      return foundEntity.hasOwnProperty("value")
        ? // @ts-ignore
          foundEntity.value
        : // @ts-ignore
          `${foundEntity.NAME} ${foundEntity.LAST_NAME}`;
    }
    return "";
  };

  return (
    <div className="column">
      <button
        className="button is-small is-info is-light is-pulled-right"
        onClick={() => {
          const { filename, content } = generateExcelFileStructureForTransfer(
            companies,
            getEntityTitle(),
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
