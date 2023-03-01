import { Stage } from "app/commonSlice";
import { useAppSelector } from "app/hooks";

export default function ProgressNotifier() {
  const processed = useAppSelector(({ company }) => company.processedAmount);
  const total = useAppSelector(({ company }) => company.totalAmount);
  const stage = useAppSelector(({ common }) => common.stage);

  const visible = total !== processed && stage === Stage.gettingData;

  return visible ? (
    <div className="column is-2">
      <progress
        className="progress is-link mb-0"
        value={processed}
        max={total}
      />
      <p className="has-text-centered">{`${total} total`}</p>
    </div>
  ) : (
    <></>
  );
}
