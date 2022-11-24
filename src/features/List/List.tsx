import { useEffect, useMemo } from "react";
import EmailFormChanger from "features/EmailFormChanger/EmailFormChanger";
import { useTable, usePagination } from "react-table";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import type { TableDataStructure } from "../../types";
import styles from "./List.module.css";
import Navigation, { NaviProps } from "./Navigation";
import ShowHideColumn from "./ShowHideColumn";
import { formColumns, formData } from "./TableDataLogic";
import { companySelector } from "./CompanySelector";
import { emailCell } from "app/CONSTANTS";

const List = () => {
  const companies = useAppSelector(companySelector);
  const { includeDeals, includeLeads } = useAppSelector(
    ({ options }) => options
  );

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

  const dispatch = useAppDispatch();
  const data: TableDataStructure = useMemo(
    () => formData(companies),
    [companies]
  );
  const columns = useMemo(
    () => formColumns(dispatch),
    // eslint-disable-next-line
    [dispatch, includeDeals, includeLeads]
  );

  const pageSize = 20;
  const tableInstance = useTable(
    {
      // @ts-ignore
      columns,
      data,
      manualPagination: false,
      initialState: {
        pageSize,
        pageIndex: useAppSelector(({ list }) => list.pageIndex),
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

  const { canPreviousPage, canNextPage, pageOptions, nextPage, previousPage } =
    tableInstance;
  const naviProps: NaviProps = {
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
  };

  return (
    <div className="column is-fullwidth">
      <table
        className="table is-bordered is-hoverable is-fullwidth"
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
                  {column.id === "company" && (
                    <ShowHideColumn
                      columnToOperate={"linkedin"}
                      thc={toggleHideColumn}
                    />
                  )}
                  {column.id === "contact" && (
                    <ShowHideColumn
                      columnToOperate={"emails"}
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
      {footer}
      <Navigation {...naviProps} />
    </div>
  );
};

const footer = (
  <footer>
    <hr />
    <div>
      <span className={`ml-4 ${styles.attention}`}>*</span> - no country
      assigned
    </div>
    <div className={`ml-4`}>
      1 - CET: <b>c</b>hange <b>e</b>mail <b>t</b>ypes
    </div>
  </footer>
);

export default List;
