import type { User, Country } from "../../types";
import excelFile from "./ExcelGeneration";
import XLSX from "xlsx-js-style";
import { useAppSelector } from "app/hooks";

const Export = () => {
  const [companies, chosenId, titleLookupArray, users] = useAppSelector(
    ({ common, company }) => [
      company.companiesWithRelatedEntities,
      common.chosenId,
      common[common.selectType],
      common.users,
    ]
  );
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
    <div className="columns">
      <div className="column">
        <button
          className="button is-small is-info is-light is-pulled-right"
          onClick={() => {
            const { filename, content } = excelFile(
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
    </div>
  );
};

export default Export;
