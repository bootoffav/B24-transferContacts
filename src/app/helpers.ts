import type {
  User,
  Country,
  Transfer,
  TransferCountry,
  EntitiesToFetch,
} from "types";
import { store } from "app/store";
import {
  allTransferEntityTypes,
  TransferButtonState,
} from "features/TransferButton/TransferButtonSlice";
import { OptionsState } from "features/Options/OptionsSlice";

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

function getAmountToTransfer(
  transferDO: Transfer | TransferCountry,
  transferType: TransferButtonState["transferType"] & string,
  transferEntityType?: typeof allTransferEntityTypes[number]
) {
  let amount = 0;

  if (transferType === "country") {
    return Object.values(transferDO).reduce((acc, set) => acc + set.length, 0);
  }

  if (transferType === "responsible") {
    switch (transferEntityType) {
      case "all":
      case undefined:
        for (const responsible in transferDO) {
          amount = Object.values(transferDO[responsible]).reduce(
            (acc, set) => set.length + acc,
            amount
          );
        }
        break;
      default:
        for (const responsible in transferDO) {
          amount +=
            // @ts-ignore
            transferDO[responsible][transferEntityType.toUpperCase()].length;
        }
    }
  }
  return amount;
}

function delay(ms = 700) {
  return new Promise((r) => setTimeout(r, ms));
}

function getOptionalEntitiesToFetch(): EntitiesToFetch {
  const map = new Map<keyof OptionsState, EntitiesToFetch[number]>([
    ["includeLeads", "lead"],
    ["includeDeals", "deal"],
  ]);

  let entitiesToFetch: EntitiesToFetch = [];
  for (const [prop, param] of map) {
    entitiesToFetch = store.getState().options[prop]
      ? [...entitiesToFetch, param]
      : entitiesToFetch;
  }
  return entitiesToFetch;
}

export {
  delay,
  getEntityTitle,
  getAmountToTransfer,
  getOptionalEntitiesToFetch,
};
