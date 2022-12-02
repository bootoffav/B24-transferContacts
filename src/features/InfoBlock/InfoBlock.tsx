import { useAppSelector } from "../../app/hooks";
import ClipLoader from "react-spinners/ClipLoader";
import { Stage } from "../../app/commonSlice";
import Transferring from "features/Transferring/Transferring";
import TransferArea from "features/TransferArea/TransferArea";

export default function InfoBlock() {
  const { stage } = useAppSelector(({ common }) => ({
    stage: common.stage,
  }));

  let output: string | JSX.Element = "";

  switch (stage) {
    case Stage.initial:
      output =
        "Choose among country, manager or departments & click Get companies";
      break;
    case Stage.gettingData:
    case Stage.cancelling:
      output = (
        <>
          <span className="p-2">
            {stage === Stage.gettingData ? "Getting data" : "Cancelling"}
          </span>
          <ClipLoader loading={true} />
        </>
      );
      break;
    case Stage.scanFinished:
      output = <TransferArea />;
      break;
    case Stage.linkedInOnlyScanFinished:
      output = "LinkedIn list ready";
      break;
    case Stage.stuck:
      output = (
        <p className="has-text-danger">Network error - report stopped!</p>
      );
      break;
    case Stage.transferring:
      output = <Transferring />;
      break;
    case Stage.transferred:
      output = (
        <div className="notification is-warning">
          DONE, to check changes click GET COMPANIES again!
        </div>
      );
      break;
  }

  return (
    <div className="columns">
      <div className="column has-text-centered is-size-5">{output}</div>
    </div>
  );
}
