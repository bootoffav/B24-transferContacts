import CountrySelector from "./features/countrySelector/CountrySelector";
import { fetchCompanies, fetchCompanyContacts, getUsers } from "./app/endpoint";
import { useDispatch, useSelector } from "react-redux";
import { setCompanies, setDifferentResponsibles } from "./app/companySlice";
import { setStage, setUsers } from "./app/commonSlice";
import InfoBlock from "./features/InfoBlock/InfoBlock";
import List from "./features/List/List";
import { useAuth0 } from "@auth0/auth0-react";
import getDifferentContactResponsibles from "./app/differentContactResponsibles";

function App() {
  const dispatch = useDispatch();
  const chosenCountryId = useSelector(
    (state: any) => state.countrySelector.chosenCountryId
  );

  // @ts-ignore
  const stage = useSelector((state) => state.common.stage);

  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated ? (
    <div className="container mt-2">
      <div className="columns">
        <div className="column has-text-weight-medium is-flex is-justify-content-end is-align-items-center">
          Choose country:
        </div>
        <div className="column is-one-fifth">
          <CountrySelector />
        </div>
        <div className="column">
          <button
            className="button is-primary"
            onClick={async () => {
              if (["5734", ""].includes(chosenCountryId)) {
                alert("choose country first");
                return;
              }

              dispatch(setStage("gettingData"));
              const users = await getUsers();
              dispatch(setUsers(users));
              const companies = await fetchCompanies(chosenCountryId);
              const companiesWithContacts: any[] = [];
              for (let company of companies) {
                const delay = async (ms = 500) =>
                  await new Promise((res) => setTimeout(res, Number(ms)));

                await delay();
                companiesWithContacts.push({
                  CONTACTS: await fetchCompanyContacts(company.ID),
                  ...company,
                });
              }
              dispatch(setCompanies(companiesWithContacts));
              dispatch(setStage("scanFinished"));
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
