import { RootState } from "app/store";
import dayjs from "dayjs";
import { User } from "types";
import { getUserNameById } from "utils/users";

const HeaderColumnStyle = {
  alignment: {
    horizontal: "center",
  },
  font: {
    sz: 14,
    bold: true,
  },
};

const generateExcelFileStructure = (
  companies: RootState["company"]["companiesWithContacts"],
  name: string,
  users: User[]
) => {
  const totalAmountOfRows = companies.reduce(
    (acc, { CONTACTS }) => acc + (CONTACTS.length ? CONTACTS.length : 1), // 1 is for company itself
    0
  );
  console.log(totalAmountOfRows);
  let ws = {
    A1: { v: "#", s: HeaderColumnStyle },
    B1: { v: "COMPANY", s: HeaderColumnStyle },
    C1: { v: "RESPONSIBLE FOR COMPANY", s: HeaderColumnStyle },
    D1: { v: "CONTACT", s: HeaderColumnStyle },
    E1: { v: "RESPONSIBLE FOR CONTACT", s: HeaderColumnStyle },

    "!ref": `A1:E${totalAmountOfRows + 1}`,
    "!cols": [
      { width: 10 },
      { width: 55 },
      { width: 30 },
      { width: 55 },
      { width: 30 },
    ],
    "!rows": [{ hpt: 30 }, ...Array(totalAmountOfRows).fill({ hpt: 20 })],
  };

  const structuredData = companies.map(
    ({ ID, TITLE, ASSIGNED_BY_ID, CONTACTS }, index) => {
      const dataRow = [String(index + 1), [ID, TITLE]]; // : #, Company
      const { NAME, LAST_NAME } = getUserNameById(users, ASSIGNED_BY_ID); // Company p.1
      dataRow.push(`${NAME} ${LAST_NAME}`); // Company p.2
      dataRow.push(
        // @ts-ignore
        CONTACTS.map((contact) => [
          contact.ID,
          `${contact.NAME} ${contact.LAST_NAME}`,
        ]), // Contact
        CONTACTS.map((contact) => {
          const { NAME, LAST_NAME } = getUserNameById(
            users,
            contact.ASSIGNED_BY_ID
          );
          return [contact.ASSIGNED_BY_ID, `${NAME} ${LAST_NAME}`]; // Responsible for Contact
        })
      );
      return dataRow;
    }
  );

  function* fillCell() {
    let rowIndex = 2;
    const columnLetters = ["A", "B", "C", "D", "E"];

    for (const row of structuredData) {
      let columnIndex = 0;
      let id, title, contactRowIndex;
      for (const v of row) {
        let toYield: any;
        switch (columnIndex) {
          case 1:
            // @ts-ignore
            [id, title] = v;
            toYield = { v: title };
            toYield.l = {
              Target: `${process.env.REACT_APP_B24_ADDRESS}crm/company/details/${id}/`,
            };
            toYield.s = {
              font: {
                underline: true,
                color: { rgb: "CC2581FF" },
              },
            };
            break;
          case 3:
          case 4:
            // @ts-ignore
            // eslint-disable-next-line
            toYield = v.map(([id, title]) => {
              const toRet: any = { v: title };
              if (columnIndex === 3) {
                toRet.l = {
                  Target: `${process.env.REACT_APP_B24_ADDRESS}crm/contact/details/${id}/`,
                };
                toRet.s = {
                  font: {
                    underline: true,
                    color: { rgb: "CC2581FF" },
                  },
                };
              }
              return toRet;
            });

            break;
          default:
            toYield = { v };
        }
        if (Array.isArray(toYield)) {
          contactRowIndex = rowIndex;
          if (toYield.length) {
            // has contacts
            for (const contactCell of toYield) {
              yield {
                [`${columnLetters[columnIndex]}${contactRowIndex}`]:
                  contactCell,
              };
              contactRowIndex += 1;
            }
          } else {
            // no contacts in Company, but should render empty cell for the company row
            yield {
              [`${columnLetters[columnIndex]}${contactRowIndex}`]: "",
            };
            contactRowIndex += 1;
          }
        } else {
          yield {
            [`${columnLetters[columnIndex]}${rowIndex}`]: toYield,
          };
        }
        columnIndex += 1;
      }
      rowIndex = contactRowIndex || rowIndex + 1;
    }
  }

  // @ts-ignore
  for (const cell of fillCell()) {
    ws = { ...ws, ...cell };
  }

  const filename = `Transfer_contacts_of${
    name ? `_${name}` : ""
  }_${dayjs().format("YYYY-MM-DD-HHmmss")}.xlsx`;

  const wb = {
    Props: {
      Title: "Transfer Contacts",
      Subject: "XMT",
      Author: "@bootoffav",
      CreatedDate: new Date(),
    },
    SheetNames: ["Transfer contacts"],
    Sheets: { "Transfer contacts": ws },
  };

  return {
    filename,
    content: wb,
  };
};

export default generateExcelFileStructure;
