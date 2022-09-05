import type { TableDataStructure, EntityType } from "types";
import styles from "./List.module.css";

const applyStyle = (
  v: string,
  responsibleForCompany: string,
  columnId: string
): string => {
  const noApplyStyleColumns = ["contactPosition"];
  if (noApplyStyleColumns.includes(columnId)) return "";
  return responsibleForCompany !== v ? styles.attention : "";
};

const { REACT_APP_B24_ADDRESS: b24Address } = process.env;

const formLink = (
  [title, id]:
    | TableDataStructure[number]["company"]
    | TableDataStructure[number]["contact"][number],
  type: EntityType
) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={`${b24Address}crm/${type}/details/${id}/`}
  >
    {title}
  </a>
);

export { formLink, applyStyle };
