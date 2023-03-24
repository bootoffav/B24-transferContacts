import { useAppSelector, useAppDispatch } from "app/hooks";
import { setStage, Stage } from "app/commonSlice";

export default function ControlButton({
  clickHandler,
}: {
  clickHandler: () => Promise<void>;
}) {
  const { stage } = useAppSelector(({ common }) => common);
  const dispatch = useAppDispatch();

  let classType, label;
  switch (stage) {
    case Stage.gettingData:
      [classType, label] = ["is-danger", "STOP"];
      break;
    case Stage.cancelling:
      [classType, label] = ["is-warning", "Cancelling..."];
      break;
    default:
      [classType, label] = ["is-primary", "Get companies"];
  }
  return (
    <button
      disabled={label === "Cancelling..."}
      className={`button ${classType}`}
      onClick={
        stage === Stage.gettingData
          ? () => dispatch(setStage(Stage.cancelling))
          : clickHandler
      }
    >
      {label}
    </button>
  );
}
