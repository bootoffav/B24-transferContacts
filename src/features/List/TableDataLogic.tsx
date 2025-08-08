import { format } from "date-fns";
import type {
  Contact,
  Company,
  TableDataStructure,
  EntityType,
  EntitiesToFetch,
} from "types";
import type { Cell } from "react-table";
import { nanoid } from "nanoid";
import { emailMap } from "features/EmailFormChanger/EmailFormChanger";
import { formLink, applyStyle } from "./utils";
import { hideModal, setContactIdForEmails } from "app/commonSlice";
import { getUserNameById } from "utils/users";
import ChangeableField from "../ChangeableField/ChangeableField";
import {
  emailCell,
  LINKEDIN_ACCOUNT_FIELD,
  CONTACT_POSITION_FIELD,
  CONTACT_COUNTRY_FIELD,
  COMPANY_1CCODE_FIELD,
} from "app/CONSTANTS";
import { store } from "app/store";
import { getOptionalEntitiesToFetch } from "app/helpers";

function prepareContact({
  ID,
  NAME,
  LAST_NAME,
  ...rest
}: Contact): TableDataStructure[number]["contact"][number] {
  return [
    LAST_NAME ? `${NAME} ${LAST_NAME}` : NAME,
    ID,
    rest[CONTACT_COUNTRY_FIELD],
  ];
}

function contactEmailCellRenderer({
  value: contactsEmails,
}: Cell<{}, TableDataStructure[number]["emails"]>) {
  return contactsEmails.map((emails) =>
    emails.length ? (
      <ul key={Math.random()} className={emailCell}>
        {emails.map(({ VALUE, VALUE_TYPE }) => (
          <li key={Math.random()}>{`${VALUE} (${emailMap.get(
            VALUE_TYPE
          )})`}</li>
        ))}
      </ul>
    ) : (
      <br key={Math.random()} />
    )
  );
}

function contactCellRenderer({
  value: contacts,
  column: { id },
}: Cell<{}, TableDataStructure[number]["contact"]>) {
  return (
    <ul>
      {contacts.map((contact, index) => {
        return (
          <li key={index} className="is-flex is-justify-content-space-between">
            <span>
              {formLink(contact, id as EntityType)}
              {/* no country case */}
              {contact.at(-1) ? "" : <span className="attention">*</span>}
            </span>
            <span
              className="is-clickable"
              onClick={() => {
                store.dispatch(setContactIdForEmails(contact[1]));
                store.dispatch(hideModal(false));
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

const formData = (companies: Company[]): TableDataStructure => {
  const { users } = store.getState().common;
  return companies.map((company) => {
    const responsibleForCompany = getUserNameById(
      users,
      company.ASSIGNED_BY_ID
    );

    return {
      company: [company.TITLE, company.ID],
      companyEmails: company.EMAIL.map((email) => email.VALUE),
      code1C: [[company[COMPANY_1CCODE_FIELD] ?? "--", company.ID]],
      createdOn: company.DATE_CREATE,
      responsibleForCompany,
      linkedin: company[LINKEDIN_ACCOUNT_FIELD],
      contact: company.CONTACTS.map(prepareContact),
      emails: company.CONTACTS.map(({ EMAILS }) => EMAILS || []),
      contactPosition: company.CONTACTS.map(
        ({ [CONTACT_POSITION_FIELD]: position, ID }) => [position ?? "--", ID]
      ),
      responsibleForContact: company.CONTACTS.map((contact) =>
        getUserNameById(users, contact.ASSIGNED_BY_ID)
      ),
      deal: company.DEALS?.map(({ ID, TITLE }) => [TITLE, ID]),
      lead: company.LEADS?.map(({ ID, TITLE }) => [TITLE, ID]),
      responsibleForDeal: company.DEALS?.map((deal) =>
        getUserNameById(users, deal.ASSIGNED_BY_ID)
      ),
      responsibleForLead: company.LEADS?.map((lead) =>
        getUserNameById(users, lead.ASSIGNED_BY_ID)
      ),
    };
  });
};

const formColumns = () => {
  function formOptionalColumnPair(oc: EntitiesToFetch[number]) {
    const capitalizedOc = oc.charAt(0).toUpperCase() + oc.substring(1);

    return [
      {
        Header: capitalizedOc,
        accessor: oc,
        Cell: getSubRows,
      },
      {
        Header: `Resp. for ${oc}`,
        accessor: `responsibleFor${capitalizedOc}`,
        Cell: getSubRows,
      },
    ];
  }

  const baseColumns = [
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
      Header: "Company emails",
      accessor: "companyEmails",
      Cell: ({ value }: Cell) => (
        <ul>
          {(value as string[]).map((email) => (
            <li key={nanoid()}>{email}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: "1C Code",
      accessor: "code1C",
      Cell: getSubRows,
    },
    {
      Header: "Created on",
      accessor: "createdOn",
      Cell: ({ value }: Cell) => format(value, "dd.MM.yyyy"),
    },
    {
      Header: "Contact",
      accessor: "contact",
      Cell: contactCellRenderer,
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
  ];

  return getOptionalEntitiesToFetch().reduce(
    (columns, oc) => [...columns, ...formOptionalColumnPair(oc)],
    baseColumns
  );
};

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
            const [value, id] = v;
            return (
              <li key={index}>
                <ChangeableField
                  entity="contact"
                  value={value}
                  field={CONTACT_POSITION_FIELD}
                  id={id as unknown as Contact["ID"]}
                />
              </li>
            );
          } catch {}
        }
        if (id === "code1C") {
          try {
            const [code1C, id] = v;
            return (
              <li key={index}>
                <ChangeableField
                  entity="company"
                  value={code1C}
                  field={COMPANY_1CCODE_FIELD}
                  id={id as unknown as Company["ID"]}
                />
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
