import type { User, Country } from "types";
import { store } from "app/store";

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

export { getEntityTitle };
