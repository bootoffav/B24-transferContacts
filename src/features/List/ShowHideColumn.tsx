import { useEffect, useState } from "react";
import type { TableInstance } from "react-table";

export default function ShowHideColumn({
  thc,
  columnToOperate,
}: {
  thc: TableInstance["toggleHideColumn"];
  columnToOperate: "emails" | "linkedin";
}) {
  const [columnHidden, setColumnHidden] = useState(
    columnToOperate === "linkedin"
  );

  useEffect(() => {
    thc(columnToOperate, columnHidden);
  }, [thc, columnHidden, columnToOperate]);

  return (
    <em
      onClick={() => setColumnHidden(!columnHidden)}
      className="is-underlined"
      style={{
        cursor: "pointer",
      }}
    >
      {`${columnHidden ? "show" : "hide"} ${columnToOperate}`}
    </em>
  );
}
