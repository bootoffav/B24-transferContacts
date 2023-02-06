import { useState } from "react";
import type { TableInstance } from "react-table";

export default function ShowHideColumn({
  columnToOperate,
  thc,
}: {
  columnToOperate: "emails" | "linkedin";
  thc: TableInstance["toggleHideColumn"];
}) {
  const [columnHidden, setColumnHidden] = useState(
    columnToOperate === "linkedin"
  );

  return (
    <em
      onClick={() => {
        thc(columnToOperate, !columnHidden);
        setColumnHidden(!columnHidden);
      }}
      className="is-underlined"
      style={{
        cursor: "pointer",
      }}
    >
      {`${columnHidden ? "show" : "hide"} ${columnToOperate}`}
    </em>
  );
}
