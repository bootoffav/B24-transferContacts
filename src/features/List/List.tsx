import { useMemo } from "react";
import EmailFormChanger from "features/EmailFormChanger/EmailFormChanger";
import { useSortBy, useTable, usePagination } from "react-table";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import type { TableDataStructure } from "../../types";
import styles from "./List.module.css";
import Navigation, { NaviProps } from "./Navigation";
import ShowHideEmails from "./ShowHideEmails";
import { formColumns, formData } from "./TableDataLogic";
import { noCountrySelector } from "./NoCountrySelector";

const List = () => {
  const viewMode = useAppSelector(({ list }) => list.viewMode);
  const companies = useAppSelector(
    viewMode === "all"
      ? ({ company }) => company.companiesWithRelatedEntities
      : noCountrySelector
  );

  const { users } = useAppSelector(({ common }) => ({
    users: common.users,
  }));

  const dispatch = useAppDispatch();
  const data: TableDataStructure = useMemo(
    () => formData(companies, users),
    [companies, users]
  );
  const columns = useMemo(() => formColumns(dispatch), [dispatch]);

  const pageSize = 20;
  const tableInstance = useTable(
    {
      // @ts-ignore
      columns,
      data,
      manualPagination: false,
      initialState: {
        pageSize,
        sortBy: [
          {
            id: "company",
          },
        ],
      },
    },
    useSortBy,
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
    pageIndex,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
  };

  return (
    <main>
      <div>
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
                    {column.id === "contact" && (
                      <ShowHideEmails thc={toggleHideColumn} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: any, i: number) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: any) =>
                    cell.column.id === "#" ? (
                      <td {...cell.getCellProps()}>
                        {pageIndex * pageSize + (i + 1)}
                      </td>
                    ) : (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    )
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        <EmailFormChanger />
      </div>
      <div>{footNote}</div>
      <Navigation {...naviProps} />
    </main>
  );
};

const footNote = (
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
