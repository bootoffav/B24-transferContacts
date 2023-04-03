import { TableInstance } from "react-table";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { setPageIndex } from "./listSlice";

export interface NaviProps {
  canPreviousPage: TableInstance["canPreviousPage"];
  canNextPage: TableInstance["canNextPage"];
  pageOptions: TableInstance["pageOptions"];
  nextPage: TableInstance["nextPage"];
  previousPage: TableInstance["previousPage"];
  gotoPage: TableInstance["gotoPage"];
}

export default function Navigation({
  canNextPage,
  canPreviousPage,
  pageOptions,
  nextPage,
  previousPage,
  gotoPage,
}: NaviProps) {
  const pageIndex = useAppSelector(({ list }) => list.pageIndex);
  const dispatch = useAppDispatch();
  return (
    <nav
      className="pagination mx-auto"
      role="navigation"
      aria-label="pagination"
      style={{
        display: `${pageOptions.length === 1 ? "none" : ""}`,
      }}
    >
      <button
        className="button bd-fat-button is-info is-light"
        onClick={() => {
          dispatch(
            setPageIndex({
              value: 0,
              options: {
                exact: true,
              },
            })
          );
          gotoPage(0);
        }}
        disabled={!canPreviousPage}
      >
        <i>\←</i>
        <span className="ml-2">First page</span>
      </button>
      <button
        className="button bd-fat-button is-primary is-light"
        onClick={() => {
          dispatch(setPageIndex(-1));
          previousPage();
        }}
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
        onClick={() => {
          dispatch(setPageIndex(1));
          nextPage();
        }}
        disabled={!canNextPage}
      >
        <span className="mr-2">Next page</span>
        <i>→</i>
      </button>
      <button
        className="button bd-fat-button is-info is-light"
        onClick={() => {
          dispatch(
            setPageIndex({
              value: pageOptions.length - 1,
              options: { exact: true },
            })
          );
          gotoPage(pageOptions.length - 1);
        }}
        disabled={!canNextPage}
      >
        <span className="mr-2">Last page</span>
        <i>→\</i>
      </button>
    </nav>
  );
}
