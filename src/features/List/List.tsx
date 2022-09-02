import { useMemo } from "react";
import { Cell, useSortBy, useTable, usePagination } from "react-table";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { hideModal, setContactIdForEmails } from "app/commonSlice";
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
import EmailFormChanger, {
  emailMap,
} from "features/EmailFormChanger/EmailFormChanger";
import { Dispatch } from "@reduxjs/toolkit";
import ShowHideEmails from "./ShowHideEmails";

const {
  REACT_APP_B24_CONTACT_POSITION_FIELD: contactPositionField,
  REACT_APP_B24_ADDRESS: b24Address,
} = process.env;

const contactCountryField =
  process.env.REACT_APP_B24_CONTACT_COUNTRY_FIELD ?? "";

const formLink = (
  [title, id]:
    | TableDataStructure[number]["company"]
    | TableDataStructure[number]["contact"][number],
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
    LAST_NAME ? `${NAME} ${LAST_NAME}` : NAME,
    ID,
    // @ts-expect-error
    rest[contactCountryField],
  ];
}

const applyStyle = (
  v: string,
  responsibleForCompany: string,
  columnId: string
): string => {
  const noApplyStyleColumns = ["contactPosition"];
  if (noApplyStyleColumns.includes(columnId)) return "";
  return responsibleForCompany !== v ? styles.attention : "";
};

function contactEmailCellRenderer({
  value: contactsEmails,
}: Cell<{}, TableDataStructure[number]["contactEmails"][]>) {
  return contactsEmails.map((contact, idx) => (
    <ul key={idx}>
      {contact.map(({ VALUE, ID, VALUE_TYPE }) => (
        <li key={ID}>
          {VALUE} ({emailMap.get(VALUE_TYPE)})
        </li>
      ))}
    </ul>
  ));
}

function contactCellRenderer(
  { value, column: { id } }: Cell<{}, TableDataStructure[number]["contact"]>,
  dispatch: Dispatch
) {
  return (
    <ul>
      {value.map((v, index) => {
        return (
          <li key={index} className="is-flex is-justify-content-space-between">
            <span>
              {formLink(v, id as EntityType)}
              {/* no country case */}
              {v.at(-1) ? "" : <span className={styles.attention}>*</span>}
            </span>
            <span
              className="ml-1 is-clickable"
              onClick={() => {
                dispatch(setContactIdForEmails(v[1]));
                dispatch(hideModal(false));
              }}
            >
              [cet]<sup>1</sup>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const List = () => {
  const { users, companies } = useAppSelector(({ company, common }) => ({
    companies: company.companiesWithRelatedEntities,
    users: common.users,
  }));
  const dispatch = useAppDispatch();

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
          contactEmails: company.CONTACTS.map(({ EMAIL }) => EMAIL || []),
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
            <li
              key={index}
              className={applyStyle(v, responsibleForCompany, id)}
            >
              {typeof v === "object" ? formLink(v, id as EntityType) : v}
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
        Header: "Contact",
        accessor: "contact",
        Cell: (cell) => contactCellRenderer(cell, dispatch),
      },
      {
        Header: "Contact emails",
        accessor: "contactEmails",
        Cell: contactEmailCellRenderer,
      },
      {
        Header: "Position",
        accessor: "contactPosition",
        Cell: getSubRows,
      },
      {
        Header: "Resp. for company",
        accessor: "responsibleForCompany",
      },
      {
        Header: "Resp. for contact",
        accessor: "responsibleForContact",
        Cell: getSubRows,
      },
      {
        Header: "Lead",
        accessor: "lead",
        Cell: getSubRows,
      },
      {
        Header: "Resp. for lead",
        accessor: "responsibleForLead",
        Cell: getSubRows,
      },
      {
        Header: "Deal",
        accessor: "deal",
        Cell: getSubRows,
      },
      {
        Header: "Resp. for deal",
        accessor: "responsibleForDeal",
        Cell: getSubRows,
      },
    ],
    [dispatch]
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
