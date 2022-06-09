import { useMemo } from "react";
import { Cell, useTable } from "react-table";
import { useAppSelector } from "../../app/hooks";
import { Company, User } from "../../types";
import { getUserNameById } from "utils/users";
import styles from "./List.module.css";

const formLink = (
  [title, id]: [string, string],
  type: "company" | "contact"
) => (
  <>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${process.env.REACT_APP_B24_ADDRESS}crm/${type}/details/${id}/`}
    >
      {title}
    </a>
  </>
);

const List = () => {
  const companies = useAppSelector(
    (state) => state.company.companiesWithContacts
  );
  const users = useAppSelector((state) => state.common.users);

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
          responsibleForCompany: `${responsibleForCompany.NAME} ${responsibleForCompany.LAST_NAME}`,
          contact: company.CONTACTS.map(({ ID, NAME, LAST_NAME }) => [
            `${NAME} ${LAST_NAME}`,
            ID,
          ]),
          responsibleForContact: company.CONTACTS.map((contact) => {
            const { NAME, LAST_NAME } = getUserNameById(
              users,
              contact.ASSIGNED_BY_ID
            );
            return `${NAME} ${LAST_NAME}`;
          }),
        };
      }),
    [companies, users]
  );

  const getSubRows = ({
    value,
    row: {
      values: { responsibleForCompany },
    },
  }: Cell) => {
    return value.map((v: [string, string] | string, index: number) => {
      return (
        <table key={index}>
          <tbody>
            <tr>
              <td
                className={
                  responsibleForCompany !== v ? styles.otherResponsible : ""
                }
              >
                {typeof v === "object" ? formLink(v, "contact") : v}
              </td>
            </tr>
          </tbody>
        </table>
      );
    });
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
    ],
    []
  );

  // @ts-ignore
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table className="table mx-auto is-fullwidth" {...getTableProps()}>
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
