import { useAppSelector } from "app/hooks";
import type { SyntheticEvent } from "react";

export default function ControlButton({
  clickHandler,
}: {
  clickHandler: ({ target }: SyntheticEvent) => void;
}) {
  const stage = useAppSelector(({ common: { stage } }) => stage);

  let classType, label;
  switch (stage) {
    case "gettingData":
      [classType, label] = ["is-danger", "STOP"];
      break;
    case "cancelling":
      [classType, label] = ["is-warning", "Cancelling..."];
      break;
    default:
      [classType, label] = ["is-primary", "Get companies"];
  }
  return (
    <button className={`button ${classType}`} onClick={clickHandler}>
      {label}
    </button>
  );
}