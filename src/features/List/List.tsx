import { useMemo } from "react";
import { Cell, useSortBy, useTable, usePagination } from "react-table";
import { useAppSelector } from "../../app/hooks";
import type {
  Company,
  Contact,
  EntityType,
  TableDataStructure,
} from "../../types";
import { getUserNameById } from "utils/users";
import styles from "./List.module.css";
import Navigation, { NaviProps } from "./Navigation";
import Position from "./Position";

const {
  REACT_APP_B24_CONTACT_POSITION_FIELD: contactPositionField,
  REACT_APP_B24_ADDRESS: b24Address,
  // REACT_APP_B24_CONTACT_COUNTRY_FIELD: contactCountryField,
} = process.env;

const contactCountryField =
  process.env.REACT_APP_B24_CONTACT_COUNTRY_FIELD ?? "";

const formLink = (
  [title, id]: TableDataStructure[number]["company"],
  type: EntityType
) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={`${b24Address}crm/${type}/details/${id}/`}
  >
    {title}
  </a>
);

function prepareContact({
  ID,
  NAME,
  LAST_NAME,
  ...rest
}: Contact): TableDataStructure[number]["contact"][number] {
  return [
    NAME + " " + (LAST_NAME ? ` ${LAST_NAME}` : ""),
    ID,
    // @ts-expect-error
    rest[contactCountryField],
  ];
}

const List = () => {
  const { users, companies } = useAppSelector(({ company, common }) => ({
    companies: company.companiesWithRelatedEntities,
    users: common.users,
  }));

  const data = useMemo<TableDataStructure>(
    () =>
      companies.map((company: Company) => {
        const responsibleForCompany = getUserNameById(
          users,
          company.ASSIGNED_BY_ID
        );

        return {
          company: [company.TITLE, company.ID],
          responsibleForCompany,
          contact: company.CONTACTS.map(prepareContact),
          contactPosition: company.CONTACTS.map(
            // @ts-expect-error
            ({ [contactPositionField!]: position, ID }) => [
              position ?? "--",
              ID,
            ]
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
    column: { id },
    row: {
      values: { responsibleForCompany },
    },
  }: Cell<{}, [string, string]>) => {
    const applyStyle = (v: string): string => {
      const noApplyStyleColumns = ["contactPosition"];
      if (noApplyStyleColumns.includes(id)) return "";
      return responsibleForCompany !== v ? styles.otherResponsible : "";
    };

    return (
      <ul>
        {value.map((v, index) => {
          if (id === "contactPosition") {
            try {
              const [position, id] = v;
              return (
                <li key={index}>
                  <Position value={position} id={id as unknown as number} />
                </li>
              );
            } catch {}
          }
          return (
            <li key={index} className={applyStyle(v)}>
              {typeof v === "object" ? formLink(v, id as EntityType) : v}
              {id === "contact" ? (v.at(-1) ? "" : "*") : ""}
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
        Header: "Position",
        accessor: "contactPosition",
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
    state: { pageIndex },
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
      <Navigation {...naviProps} />
      {footNote}
    </>
  );
};

const footNote = (
  <div>
    <hr />
    <span className={styles.otherResponsible}>*</span> - no country assigned
  </div>
);
export default List;
