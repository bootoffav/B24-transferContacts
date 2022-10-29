import { Stage } from "app/commonSlice";
import { useAppSelector } from "app/hooks";

export default function ProgressNotifier() {
  const companiesProcessedAmount = useAppSelector(
    ({ company }) => company.processedAmount
  );
  const companiesTotalAmount = useAppSelector(
    ({ company }) => company.totalAmount
  );
  const stage = useAppSelector(({ common }) => common.stage);

  const visible =
    ![0, companiesTotalAmount].includes(companiesProcessedAmount) &&
    stage === Stage.gettingData;

  return (
    <div className="column is-2">
      {visible ? (
        <>
          <progress
            className="progress is-link mb-0"
            value={companiesProcessedAmount}
            max={companiesTotalAmount}
          />
          <p className="has-text-centered">{`${companiesTotalAmount} total`}</p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
