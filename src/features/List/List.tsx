import { useMemo } from "react";
import { Cell, useTable } from "react-table";
import { useAppSelector } from "../../app/hooks";
import { Company, EntityType } from "../../types";
import { getUserNameById } from "utils/users";
import styles from "./List.module.css";

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
          position: index + 1,
          company: [company.TITLE, company.ID],
          responsibleForCompany,
          contact: company.CONTACTS.map(({ ID, NAME, LAST_NAME }) => [
            `${NAME} ${LAST_NAME}`,
            ID,
          ]),
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
        accessor: "position",
      },
      {
        Header: "Company",
        accessor: "company",
        Cell: ({ value }: Cell) => formLink(value, "company"),
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

  // @ts-ignore
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
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
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default List;
