import { useEffect, useState } from "react";
import type { TableInstance } from "react-table";

export default function ShowHideEmails({
  thc,
}: {
  thc: TableInstance["toggleHideColumn"];
}) {
  const [columnHidden, setColumnHidden] = useState(true);

  useEffect(() => {
    thc("contactEmails", columnHidden);
  }, [thc, columnHidden]);

  return (
    <em
      onClick={() => setColumnHidden(!columnHidden)}
      className="is-underlined"
      style={{
        cursor: "pointer",
      }}
    >
      {columnHidden ? "show" : "hide"} emails
    </em>
  );
}
