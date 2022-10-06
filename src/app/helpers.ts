import type { User, Country } from "types";

function getEntityTitle(titleLookupArray: any, chosenId: number): string {
  const foundEntity: User | Country = titleLookupArray.find(
    ({ ID }: User | Country) => Number(ID) === chosenId
  );
  return foundEntity
    ? "value" in foundEntity
      ? foundEntity.value
      : `${foundEntity.NAME} ${foundEntity.LAST_NAME}`
    : "";
}

export { getEntityTitle };
