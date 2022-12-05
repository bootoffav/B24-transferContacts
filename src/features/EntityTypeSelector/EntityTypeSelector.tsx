import { setSelectType, setChosenId, selectType } from "app/commonSlice";
import { useAppDispatch } from "app/hooks";
import { CommonState } from "app/commonSlice";

const OPTION_TEXT_MAP = new Map([
  ["users", "Manager"],
  ["companyCountryList", "Country"],
  ["departments", "Departments"],
]);

export default function EntityTypeSelector() {
  const dispatch = useAppDispatch();

  return (
    <div className="select is-fullwidth">
      <select
        onChange={({ target: { value } }) => {
          dispatch(setSelectType(value as CommonState["selectType"]));
          dispatch(setChosenId([]));
        }}
      >
        {renderOptions()}
      </select>
    </div>
  );
}

const renderOptions = () =>
  selectType.map((type) => {
    return (
      <option key={type} data-testid={type} value={type}>
        {OPTION_TEXT_MAP.get(type)}
      </option>
    );
  });

export { renderOptions, OPTION_TEXT_MAP };
