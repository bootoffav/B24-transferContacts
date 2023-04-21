import { useEffect, useMemo } from "react";
import EmailFormChanger from "features/EmailFormChanger/EmailFormChanger";
import { useTable, usePagination } from "react-table";
import { useAppSelector } from "../../app/hooks";
import type { TableDataStructure } from "../../types";
import Navigation, { NaviProps } from "./Navigation";
import ShowHideColumn from "./ShowHideColumn";
import { formColumns, formData } from "./TableDataLogic";
import { companySelector } from "./companySelector";
import { emailCell } from "app/CONSTANTS";

const List = () => {
  const companies = useAppSelector(companySelector);

  useEffect(() => {
    const uls = document.getElementsByClassName(emailCell);
    [...uls].forEach((ul, idx) => {
      try {
        // change size of li for contact cell
        ul.parentElement!.previousElementSibling!.firstChild!.childNodes[
          idx
          // @ts-expect-error
        ].style.height = `${ul.offsetHeight}px`;
        // change size of li for position cell
        ul.parentElement!.nextElementSibling!.firstChild!.childNodes[
          idx
          // @ts-expect-error
        ].style.height = `${ul.clientHeight}px`;
      } catch {}
    });
  });

  const data: TableDataStructure = useMemo(
    () => formData(companies),
    [companies]
  );
  const columns = useMemo(() => formColumns(), []);

  const pageSize = 20;
  const tableInstance = useTable(
    {
      // @ts-ignore
      columns,
      data,
      manualPagination: false,
      autoResetHiddenColumns: false,
      initialState: {
        pageSize,
        pageIndex: useAppSelector(({ list }) => list.pageIndex),
        hiddenColumns: ["linkedin"],
      },
    },
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex },
    toggleHideColumn,
  } = tableInstance;

  const {
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    gotoPage,
  } = tableInstance;
  const naviProps: NaviProps = {
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    gotoPage,
  };

  return (
    <div className="column">
      <table
        className="table table-font-small is-bordered is-hoverable is-fullwidth"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps({
                    className: "has-text-centered",
                  })}
                >
                  {column.render("Header")}{" "}
                  {["contact", "company"].includes(column.id) && (
                    <ShowHideColumn
                      columnToOperate={
                        column.id === "contact" ? "emails" : "linkedin"
                      }
                      thc={toggleHideColumn}
                    />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(({ column: { id }, getCellProps, render }) => (
                  <td {...getCellProps()}>
                    {id === "#"
                      ? pageIndex * pageSize + (i + 1)
                      : render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <EmailFormChanger />
      <Navigation {...naviProps} />
    </div>
  );
};

export default List;
