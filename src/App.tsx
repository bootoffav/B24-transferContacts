import CountrySelector from "./features/countrySelector/CountrySelector";
import { fetchCompanies, fetchCompanyContacts, getUsers } from "./app/endpoint";
import { useDispatch, useSelector } from "react-redux";
import { set } from "./app/companySlice";
import { setStage, setUsers } from "./app/commonSlice";
import InfoBlock from "./features/InfoBlock/InfoBlock";
import List from "./features/List/List";

function App() {
  const dispatch = useDispatch();
  const chosenCountryId = useSelector(
    (state: any) => state.countrySelector.chosenCountryId
  );
  // @ts-ignore
  const stage = useSelector((state) => state.common.stage);

  return (
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
              dispatch(setStage("gettingUsers"));
              const users = await getUsers();
              dispatch(setUsers(users));
              dispatch(setStage("gettingCompanies"));
              const companies = await fetchCompanies(chosenCountryId);
              const companiesWithContacts: any[] = [];
              for (let company of companies) {
                companiesWithContacts.push({
                  CONTACTS: await fetchCompanyContacts(company.ID),
                  ...company,
                });
              }
              dispatch(set(companiesWithContacts));
              dispatch(setStage("scanFinished"));
            }}
          >
            Get companies
          </button>
        </div>
      </div>
      <InfoBlock />
      {stage === "scanFinished" && <List />}
    </div>
  );
}
export default App;
