import { setSelectType, setChosenId } from "app/commonSlice";
import { useAppDispatch } from "app/hooks";
import { CommonState } from "app/commonSlice";

export default function EntityTypeSelector() {
  const dispatch = useAppDispatch();
  return (
    <div className="select is-fullwidth">
      <select
        defaultValue="users"
        onChange={({ target: { value } }) => {
          dispatch(setSelectType(value as CommonState["selectType"]));
          dispatch(setChosenId());
        }}
      >
        <option value="users">Manager</option>
        <option value="companyCountryList">Country</option>
        <option value="departments">Departments</option>
      </select>
    </div>
  );
}
