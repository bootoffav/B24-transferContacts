import { useMemo } from "react";
import { useTable } from "react-table";
import { useSelector } from "react-redux";

function getUserNameById(users: any[], id: string) {
  return (
    users.find(({ ID }: any) => ID === id) || { NAME: "unknown", LAST_NAME: "" }
  );
}

const List = () => {
  // @ts-ignore
  const companies = useSelector((state) => state.company.companiesWithContacts);
  // @ts-ignore
  const users = useSelector((state) => state.common.users);

  const data = useMemo(
    () =>
      companies.map((company: any, index: number) => {
        const responsibleForCompany = getUserNameById(
          users,
          company.ASSIGNED_BY_ID
        );

        return {
          position: index + 1,
          company: company.TITLE,
          responsibleForCompany: `${responsibleForCompany.NAME} ${responsibleForCompany.LAST_NAME}`,
          contact: company.CONTACTS.map(
            (contact: any) => `${contact.NAME} ${contact.LAST_NAME}`
          ),
          responsibleForContact: company.CONTACTS.map(
            (contact: any) =>
              getUserNameById(users, contact.ASSIGNED_BY_ID).NAME
          ),
        };
      }),
    [companies]
  );

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "position",
      },
      {
        Header: "Company",
        accessor: "company",
      },
      {
        Header: "Responsible for company",
        accessor: "responsibleForCompany",
      },
      {
        Header: "Contact",
        accessor: "contact",
      },
      {
        Header: "Responsible for contact",
        accessor: "responsibleForContact",
      },
    ],
    []
  );

  // @ts-ignore
  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table className="table mx-auto" {...getTableProps()}>
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
