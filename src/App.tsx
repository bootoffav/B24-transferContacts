import CountrySelector from "./features/countrySelector/CountrySelector";

function App() {
  return (
    <div className="container mt-2">
      <div className="columns">
        <div className="column has-text-weight-medium is-flex is-justify-content-end is-align-items-center">
          Choose country:
        </div>
        <div className="column">
          <CountrySelector />
        </div>
      </div>
    </div>
  );
}
export default App;
