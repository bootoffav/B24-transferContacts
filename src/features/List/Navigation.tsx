import { TableInstance } from "react-table";

export interface NaviProps {
  canPreviousPage: TableInstance["canPreviousPage"];
  canNextPage: TableInstance["canNextPage"];
  pageOptions: TableInstance["pageOptions"];
  nextPage: TableInstance["nextPage"];
  previousPage: TableInstance["previousPage"];
  pageIndex: TableInstance["state"]["pageIndex"];
}

export default function Navigation({
  canNextPage,
  canPreviousPage,
  pageOptions,
  nextPage,
  previousPage,
  pageIndex,
}: NaviProps) {
  return (
    <nav
      className="pagination mx-auto"
      role="navigation"
      aria-label="pagination"
      style={{
        width: "60%",
        display: `${pageOptions.length === 1 ? "none" : ""}`,
      }}
    >
      <button
        className="button bd-fat-button is-primary is-light"
        onClick={() => previousPage()}
        disabled={!canPreviousPage}
      >
        <i>←</i>
        <span className="ml-2">Previous page</span>
      </button>
      <strong>
        Page {pageIndex + 1} of {pageOptions.length}
      </strong>{" "}
      <button
        className="button bd-fat-button is-primary is-light"
        onClick={() => nextPage()}
        disabled={!canNextPage}
      >
        <span className="mr-2">Next page</span>
        <i>→</i>
      </button>
    </nav>
  );
}
