import type { User, Country, Transfer } from "types";
import { store } from "app/store";
import { allTransferEntityTypes } from "features/TransferButton/TransferButtonSlice";

function getEntityTitle(): string {
  const { common } = store.getState();

  switch (common.selectType) {
    case "companyCountryList":
    case "users":
      const foundEntity = (common[common.selectType] as any[]).find(
        ({ ID }: User | Country) => Number(ID) === common.chosenId[0]
      );
      return foundEntity
        ? "value" in foundEntity
          ? foundEntity.value // country
          : `${foundEntity.NAME} ${foundEntity.LAST_NAME}` // user
        : "";
    case "departments":
      return (
        Object.entries(common.departments).find(
          ([_1, [_2, usersId]]) =>
            JSON.stringify(usersId) === JSON.stringify(common.chosenId)
        )?.[0] || ""
      );
  }
}

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

export { getEntityTitle, differentResponsiblesAmount };
