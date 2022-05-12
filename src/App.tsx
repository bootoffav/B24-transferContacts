import { useAppDispatch, useAppSelector } from "app/hooks";
import { setSelectType, setChosenId } from "app/commonSlice";
import InfoBlock from "features/InfoBlock/InfoBlock";
import List from "features/List/List";
import { useAuth0 } from "@auth0/auth0-react";
import { CommonState } from "app/commonSlice";
import EntitySelector from "features/EntitySelector/EntitySelector";
import GetCompanies from "features/GetCompanies/GetCompanies";

function App() {
  const dispatch = useAppDispatch();
  const stage = useAppSelector((state) => state.common.stage);
  const selectType = useAppSelector((state) => state.common.selectType);

  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated ? (
    <div className="container mt-2">
      <div className="columns">
        <div className="column has-text-weight-medium is-flex is-justify-content-end is-align-items-center">
          Choose:
        </div>
        <div className="column is-2">
          <div className="select is-fullwidth">
            <select
              defaultValue={"manager"}
              onChange={({ target: { value } }) => {
                dispatch(setSelectType(value as CommonState["selectType"]));
                dispatch(setChosenId(""));
              }}
            >
              <option value="users">Manager</option>
              <option value="countries">Country</option>
            </select>
          </div>
        </div>
        <div className="column is-one-fifth">
          <EntitySelector selectType={selectType} />
        </div>
        <div className="column">
          <GetCompanies />
        </div>
      </div>
      <InfoBlock />
      {stage === "scanFinished" && <List />}
    </div>
  ) : (
    <>{loginWithRedirect()}</>
  );
}
export default App;
