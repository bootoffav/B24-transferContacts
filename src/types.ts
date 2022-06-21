declare global {
  interface Window {
    aborted?: boolean;
  }
}

export type Country = {
  value: string;
  ID: number;
};

export interface User {
  NAME: string;
  LAST_NAME: string;
  ID: number;
  ACTIVE: boolean;
}

export interface Company {
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
  TITLE: string;
  ASSIGNED_BY_ID: number;
  ID: number;
  NAME: string;
  LAST_NAME: string;
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

export type EntityType = "company" | "contact" | "deal" | "lead";
