import { Transfer } from "types";
import { allTransferEntityTypes } from "./TransferButton/TransferButtonSlice";

function differentResponsiblesAmount(
  differentResponsibles: Transfer,
  transferType?: typeof allTransferEntityTypes[number]
) {
  let amount = 0;

  switch (transferType) {
    case "all":
    case undefined:
      for (const responsible in differentResponsibles) {
        amount = Object.values(differentResponsibles[responsible]).reduce(
          (acc, set) => set.length + acc,
          0
        );
      }
      break;
    default:
      for (const responsible in differentResponsibles) {
        amount +=
          // @ts-ignore
          differentResponsibles[responsible][transferType.toUpperCase()].length;
      }
  }
  return amount;
}

export { differentResponsiblesAmount };
