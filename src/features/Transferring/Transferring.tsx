import { useAppSelector } from "app/hooks";
import { getAmountToTransfer } from "app/helpers";
import ClipLoader from "react-spinners/ClipLoader";
import type { TransferButtonState } from "../TransferButton/TransferButtonSlice";

export default function Transferring() {
  const {
    transferredAmount,
    differentResponsibles,
    transferEntityType,
    transferType,
    contactsHasNoCountries,
  } = useAppSelector(({ common, company, transferButton }) => ({
    transferredAmount: common.transferredAmount,
    differentResponsibles: company.differentResponsibles,
    transferEntityType: transferButton.transferEntityType,
    transferType: transferButton.transferType,
    contactsHasNoCountries: company.contactsNoCountries,
  }));

  const text = new Map<TransferButtonState["transferType"] & string, string>([
    [
      "responsible",
      `Transferring ${transferredAmount} of ${getAmountToTransfer(
        differentResponsibles,
        "responsible",
        transferEntityType
      )} ${
        transferEntityType === "all" ? "entities" : transferEntityType
      } to responsibles of their companies`,
    ],
    [
      "country",
      `Transferring ${transferredAmount} of ${getAmountToTransfer(
        contactsHasNoCountries,
        "country"
      )} contact's countries to same as company ones`,
    ],
  ]);

  return (
    <>
      <span className="p-2">
        {text.get(transferType as TransferButtonState["transferType"] & string)}
      </span>
      <ClipLoader loading={true} />
    </>
  );
}
