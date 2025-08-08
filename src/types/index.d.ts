declare global {
  interface Window {
    aborted?: boolean;
  }
}

export interface Contact {
  [CONTACT_POSITION_FIELD]: string;
  [CONTACT_COUNTRY_FIELD]: `${number}`;
  TITLE: string;
  ASSIGNED_BY_ID: number;
  ID: number;
  NAME: string;
  LAST_NAME: string;
  HAS_EMAIL: "Y" | "N";
  EMAILS: {
    ID: `${number}`;
    VALUE_TYPE: "WORK" | "MAILING" | "OTHER" | "HOME";
    VALUE: string;
    TYPE_ID: "EMAIL";
  }[];
}

import {
  COMPANY_1CCODE_FIELD,
  COMPANY_COUNTRY_FIELD,
  CONTACT_COUNTRY_FIELD,
  CONTACT_POSITION_FIELD,
  LINKEDIN_ACCOUNT_FIELD,
} from "app/CONSTANTS";

export type Country = {
  value: string;
  ID: `${number}`;
};

export type Departments = {
  // [Department name]: [department id, department users' id]
  [key: string]: [number, number[]];
};

export interface User {
  NAME: string;
  LAST_NAME: string;
  ID: number;
  ACTIVE: boolean;
  UF_DEPARTMENT: number[];
}

export interface Company {
  [LINKEDIN_ACCOUNT_FIELD]: string;
  [COMPANY_COUNTRY_FIELD]: `${number}`;
  [COMPANY_1CCODE_FIELD]: string;
  TITLE: string;
  ASSIGNED_BY_ID: number;
  ID: number;
  CONTACTS: Contact[];
  DEALS: Deal[];
  LEADS: Lead[];
  EMAIL: {
    ID: `${number}`;
    VALUE: string;
  }[];
  HAS_EMAIL: "Y" | "N";
}

export interface Lead {
  TITLE: string;
  ASSIGNED_BY_ID: number;
  ID: number;
}

export interface Deal {
  ASSIGNED_BY_ID: number;
  ID: number;
  TITLE: string;
}

// key is Responsible ID
// value is array of Contacts, Leads, Deals IDs that need to be transferred
export interface Transfer {
  [key: number]: {
    CONTACTS: number[];
    DEALS: number[];
    LEADS: number[];
  };
}

export interface TransferCountry {
  [key: number]: number[];
}

export type TableDataStructure = {
  company: [string, number];
  companyEmails: string[];
  responsibleForCompany: string;
  contact: [string, number, `${number}`][];
  emails: Contact["EMAILS"][];
  contactPosition: [string, number][];
  deal?: (string | number)[][];
  lead?: (string | number)[][];
  responsibleForContact: string[];
  responsibleForDeal?: string[];
  responsibleForLead?: string[];
}[];

export type EntitiesToFetch = ("deal" | "lead")[];
export type EntityType = "company" | "contact" | "deal" | "lead";
