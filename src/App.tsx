import { fetchCompanies, fetchCompanyContacts } from "./app/endpoint";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import {
  setCompanies,
  setDifferentResponsibles,
  setTotalAmount,
  setProcessedAmount,
} from "./app/companySlice";
import { setSelectType, setStage, setChosenId } from "./app/commonSlice";
import InfoBlock from "./features/InfoBlock/InfoBlock";
import List from "./features/List/List";
import { useAuth0 } from "@auth0/auth0-react";
import getDifferentContactResponsibles from "./app/differentContactResponsibles";
import { CommonState } from "./app/commonSlice";
import { Company } from "./types";
import EntitySelector from "./features/EntitySelector/EntitySelector";

function App() {
  const dispatch = useAppDispatch();
  const chosenId = useAppSelector((state) => state.common.chosenId);

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
          <button
            className="button is-primary"
            onClick={async () => {
              if (chosenId === "") {
                alert(`choose ${selectType} first`);
                return;
              }

              dispatch(setStage("gettingData"));
              const companies = await fetchCompanies(chosenId, selectType);
              dispatch(setTotalAmount(companies.length));
              const companiesWithContacts: Company[] = [];
              for (let company of companies) {
                const delay = async (ms = 500) =>
                  await new Promise((res) => setTimeout(res, Number(ms)));

                await delay();
                companiesWithContacts.push({
                  ...company,
                  CONTACTS: await fetchCompanyContacts(company.ID),
                });
                dispatch(setProcessedAmount(1));
              }
              dispatch(setCompanies(companiesWithContacts));
              dispatch(setStage("scanFinished"));
              dispatch(setProcessedAmount(0));
              dispatch(setTotalAmount(0));
              const differentResponsibles = getDifferentContactResponsibles(
                companiesWithContacts
              );
              dispatch(setDifferentResponsibles(differentResponsibles));
            }}
          >
            Get companies
          </button>
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
