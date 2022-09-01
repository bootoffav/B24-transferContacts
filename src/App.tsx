import { useAppDispatch, useAppSelector } from "app/hooks";
import { setSelectType, setChosenId } from "app/commonSlice";
import InfoBlock from "features/InfoBlock/InfoBlock";
import List from "features/List/List";
import { useAuth0 } from "@auth0/auth0-react";
import { CommonState } from "app/commonSlice";
import EntitySelector from "features/EntitySelector/EntitySelector";
import GetCompanies from "features/GetCompanies/GetCompanies";
import Export from "features/Export/Export";
import "./styles.scss";
import { ClipLoader } from "react-spinners";

export default function App() {
  const dispatch = useAppDispatch();
  const { stage, selectType, companies } = useAppSelector(
    ({ common, company }) => ({
      stage: common.stage,
      selectType: common.selectType,
      companies: company.companiesWithRelatedEntities,
    })
  );

  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <ClipLoader className="centered" loading={true} size={300} />;
  }

  return isAuthenticated ? (
    <div className="container is-fluid mt-2">
      <div className="columns is-flex is-align-items-center is-justify-content-center">
        <div className="column is-2">
          <span className="is-pulled-right">Choose:</span>
        </div>
        <div className="column is-2">
          <div className="select is-fullwidth">
            <select
              defaultValue={"manager"}
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
          <EntitySelector selectType={selectType} />
        </div>
        <div className="column is-2">
          <GetCompanies />
        </div>
      </div>
      <InfoBlock />
      {(stage === "scanFinished" && companies.length && (
        <>
          <Export />
          <List />
        </>
      )) ||
        ""}
    </div>
  ) : (
    <>{loginWithRedirect()}</>
  );
}
