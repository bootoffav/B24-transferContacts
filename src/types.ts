export type Country = {
  value: string;
  id: string;
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
}

export interface Contact {
  TITLE: string;
  ASSIGNED_BY_ID: number;
  ID: number;
  NAME: string;
  LAST_NAME: string;
}

// key is Responsible ID
// value is array of Contacts ID that need to be transferred
export interface Transfer {
  [key: number]: number[];
}
