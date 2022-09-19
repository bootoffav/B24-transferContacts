import type {
  Contact,
  TableDataStructure,
  EntityType,
  Company,
  User,
} from "types";
import type { Cell } from "react-table";
import { emailMap } from "features/EmailFormChanger/EmailFormChanger";
import { Dispatch } from "@reduxjs/toolkit";
import { formLink, applyStyle } from "./utils";
import { hideModal, setContactIdForEmails } from "app/commonSlice";
import styles from "./List.module.css";
import { getUserNameById } from "utils/users";
import Position from "./Position";

const {
  REACT_APP_B24_CONTACT_POSITION_FIELD: contactPositionField,
  REACT_APP_B24_CONTACT_COUNTRY_FIELD: contactCountryField = "",
  REACT_APP_B24_LINKEDIN_ACCOUNT_FIELD: linkedInAccountField,
} = process.env;

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

function contactEmailCellRenderer({
  value: contactsEmails,
}: Cell<{}, TableDataStructure[number]["emails"]>) {
  return contactsEmails.map((emails, idx) =>
    emails.length ? (
      <ul key={idx}>
        {emails.map(({ VALUE, ID, VALUE_TYPE }) => (
          <li key={ID}>{`${VALUE} (${emailMap.get(VALUE_TYPE)})`}</li>
        ))}
      </ul>
    ) : (
      <br />
    )
  );
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

const formData = (companies: Company[], users: User[]): TableDataStructure =>
  companies.map((company) => {
    const responsibleForCompany = getUserNameById(
      users,
      company.ASSIGNED_BY_ID
    );

    return {
      company: [company.TITLE, company.ID],
      responsibleForCompany,
      // @ts-ignore
      linkedin: company[linkedInAccountField],
      contact: company.CONTACTS.map(prepareContact),
      emails: company.CONTACTS.map(({ EMAILS }) => EMAILS || []),
      contactPosition: company.CONTACTS.map(
        // @ts-expect-error
        ({ [contactPositionField!]: position, ID }) => [position ?? "--", ID]
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
  });

const formColumns = (dispatch: Dispatch) => [
  {
    Header: "#",
  },
  {
    Header: "Company",
    accessor: "company",
    Cell: ({ value }: Cell) => formLink(value, "company"),
  },
  {
    Header: "LinkedIn",
    accessor: "linkedin",
  },
  {
    Header: "Contact",
    accessor: "contact",
    Cell: (cell: Cell) => contactCellRenderer(cell, dispatch),
  },
  {
    Header: "Contact emails",
    accessor: "emails",
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
];

function getSubRows({
  value,
  column: { id },
  row: {
    values: { responsibleForCompany },
  },
}: Cell<{}, [string, string]>) {
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
          <li key={index} className={applyStyle(v, responsibleForCompany, id)}>
            {typeof v === "object" ? formLink(v, id as EntityType) : v}
          </li>
        );
      })}
    </ul>
  );
}

export { formColumns, formData };
