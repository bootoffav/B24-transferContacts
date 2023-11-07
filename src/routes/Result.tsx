import { Stage } from "app/commonSlice";
import { ViewMode } from "features/List/listSlice";
import List from "features/List/List";
import Footer from "features/Footer/Footer";
import Export from "features/Export/Export";
import CompanyFilter from "features/CompanyFilter/CompanyFilter";
import { useAppSelector } from "app/hooks";
import { BulkCountryChange } from "features/BulkCountryChange/BulkCountryChange";

export default function Result() {
  const { viewMode } = useAppSelector(({ list }) => list);
  const { stage, thereAreNoCompaniesToShow } = useAppSelector(
    ({ common, company: { companies } }) => ({
      stage: common.stage,
      thereAreNoCompaniesToShow: companies.length === 0,
    })
  );

  return thereAreNoCompaniesToShow ||
    [Stage.linkedInOnlyScanFinished, Stage.initial].includes(stage) ? (
    <></>
  ) : (
    <>
      <div className="columns">
        <CompanyFilter />
        {viewMode === ViewMode.noCountries && <BulkCountryChange />}
        <Export />
      </div>
      <div className="columns">
        <List />
      </div>
      <Footer />
    </>
  );
}
