import { Stage } from "app/commonSlice";
import List from "features/List/List";
import Footer from "features/Footer/Footer";
import Export from "features/Export/Export";
import CompanyFilter from "features/CompanyFilter/CompanyFilter";
import { useAppSelector } from "app/hooks";

export default function Result() {
  const stage = useAppSelector(({ common }) => common.stage);
  return ![Stage.linkedInOnlyScanFinished, Stage.initial].includes(stage) ? (
    <>
      <div className="columns">
        <CompanyFilter />
        <Export />
      </div>
      <div className="columns">
        <List />
      </div>
      <Footer />
    </>
  ) : (
    <></>
  );
}
