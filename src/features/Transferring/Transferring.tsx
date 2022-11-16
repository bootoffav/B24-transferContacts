import { useAppSelector } from "app/hooks";
import { differentResponsiblesAmount } from "features/helpers";
import ClipLoader from "react-spinners/ClipLoader";

export default function Transferring() {
  const { transferredAmount, differentResponsibles, transferEntityType } =
    useAppSelector(({ common, company, transferButton }) => {
      return {
        transferredAmount: common.transferredAmount,
        differentResponsibles: company.differentResponsibles,
        transferEntityType: transferButton.transferEntityType,
      };
    });

  return (
    <>
      <span className="p-2">
        Transferring {transferredAmount} of{" "}
        {differentResponsiblesAmount(differentResponsibles, transferEntityType)}{" "}
        {transferEntityType === "all" ? "entities" : transferEntityType} to
        responsibles of their companies.
        {}
      </span>
      <ClipLoader loading={true} />
    </>
  );
}
