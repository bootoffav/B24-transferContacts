import { useMemo } from "react";
import { Cell, useSortBy, useTable, usePagination } from "react-table";
import { useAppSelector } from "../../app/hooks";
import { Company, Contact, EntityType } from "../../types";
import { getUserNameById } from "utils/users";
import styles from "./List.module.css";

const contactPositionField = process.env.REACT_APP_B24_CONTACT_POSITION_FIELD!;
const formLink = ([title, id]: [string, string], type: EntityType) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={`${process.env.REACT_APP_B24_ADDRESS}crm/${type}/details/${id}/`}
  >
    {title}
  </a>
);

const List = () => {
  const { users, companies } = useAppSelector(({ company, common }) => ({
    companies: company.companiesWithRelatedEntities,
    users: common.users,
  }));

  const data = useMemo(
    () =>
      companies.map((company: Company, index: number) => {
        const responsibleForCompany = getUserNameById(
          users,
          company.ASSIGNED_BY_ID
        );

        return {
          company: [company.TITLE, company.ID],
          responsibleForCompany,
          contact: company.CONTACTS.map(
            ({
              ID,
              NAME,
              LAST_NAME,
            }: // [contactPositionField]: position,
            any) => {
              // return [`${NAME} ${LAST_NAME}, (${position})`, ID];
              return [`${NAME} ${LAST_NAME}`, ID];
            }
          ),
          deal: company.DEALS.map(({ ID, TITLE }) => [TITLE, ID]),
          lead: company.LEADS.map(({ ID, TITLE }) => [TITLE, ID]),
          responsibleForContact: company.CONTACTS.map((contact) =>
            getUserNameById(users, contact.ASSIGNED_BY_ID)
          ),
          responsibleForDeal: company.DEALS.map((deal) =>
            getUserNameById(users, deal.ASSIGNED_BY_ID)
          ),
          responsibleForLead: company.LEADS.map((lead) =>
            getUserNameById(users, lead.ASSIGNED_BY_ID)
          ),
        };
      }),
    [companies, users]
  );

  const getSubRows = ({
    value,
    column,
    row: {
      values: { responsibleForCompany },
    },
  }: Cell) => {
    return (
      <ul>
        {value.map((v: [string, string] | string, index: number) => {
          return (
            <li
              key={index}
              className={
                responsibleForCompany !== v ? styles.otherResponsible : ""
              }
            >
              {typeof v === "object" ? formLink(v, column.id as EntityType) : v}
            </li>
          );
        })}
      </ul>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "#",
      },
      {
        Header: "Company",
        accessor: "company",
        Cell: ({ value }: Cell) => formLink(value, "company"),
        // sortType: memoizedSort,
      },
      {
        Header: "Responsible for company",
        accessor: "responsibleForCompany",
      },
      {
        Header: "Contact",
        accessor: "contact",
        Cell: getSubRows,
      },
      {
        Header: "Responsible for contact",
        accessor: "responsibleForContact",
        Cell: getSubRows,
      },
      {
        Header: "Lead",
        accessor: "lead",
        Cell: getSubRows,
      },
      {
        Header: "Responsible for lead",
        accessor: "responsibleForLead",
        Cell: getSubRows,
      },
      {
        Header: "Deal",
        accessor: "deal",
        Cell: getSubRows,
      },
      {
        Header: "Responsible for Deal",
        accessor: "responsibleForDeal",
        Cell: getSubRows,
      },
    ],
    []
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
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = tableInstance;

  return (
    <>
      <table
        className="table is-bordered is-hoverable is-fullwidth"
        {...getTableProps()}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
    </>
  );
};

export default List;
