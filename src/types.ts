import {
  COMPANY_COUNTRY_FIELD,
  CONTACT_COUNTRY_FIELD,
  CONTACT_POSITION_FIELD,
  LINKEDIN_ACCOUNT_FIELD,
} from "./app/CONSTANTS";

declare global {
  interface Window {
    aborted?: boolean;
  }
}

export type Country = {
  value: string;
  ID: string;
};

export interface User {
  NAME: string;
  LAST_NAME: string;
  ID: number;
  ACTIVE: boolean;
}

export interface Company {
  [LINKEDIN_ACCOUNT_FIELD]: string;
  [COMPANY_COUNTRY_FIELD]: string;
  TITLE: string;
  ASSIGNED_BY_ID: number;
  ID: number;
  CONTACTS: Contact[];
  DEALS: Deal[];
  LEADS: Lead[];
}

export interface Lead {
  TITLE: string;
  ASSIGNED_BY_ID: number;
  ID: number;
}

export interface Contact {
  [CONTACT_POSITION_FIELD]: string;
  [CONTACT_COUNTRY_FIELD]: string;
  TITLE: string;
  ASSIGNED_BY_ID: number;
  ID: number;
  NAME: string;
  LAST_NAME: string;
  EMAILS: {
    ID: `${number}`;
    VALUE_TYPE: "WORK" | "MAILING" | "OTHER" | "HOME";
    VALUE: string;
    TYPE_ID: "EMAIL";
  }[];
}

export interface Deal {
  ASSIGNED_BY_ID: number;
  ID: number;
  TITLE: string;
}

// key is Responsible ID
// value is array of Contacts ID that need to be transferred
export interface Transfer {
  [key: number]: {
    CONTACTS: number[];
    DEALS: number[];
    LEADS: number[];
  };
}

export type TableDataStructure = {
  company: [string, number];
  responsibleForCompany: string;
  contact: [string, number, string | null][];
  emails: Contact["EMAILS"][];
  contactPosition: [string, number][];
  deal: (string | number)[][];
  lead: (string | number)[][];
  responsibleForContact: string[];
  responsibleForDeal: string[];
  responsibleForLead: string[];
}[];

export type EntityType = "company" | "contact" | "deal" | "lead";
