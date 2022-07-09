import { RootState } from "app/store";
import dayjs from "dayjs";
import { User, Contact, Company, Lead, Deal } from "types";
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
  companies: RootState["company"]["companiesWithRelatedEntities"],
  name: string,
  users: User[]
) => {
  const totalAmountOfRows = companies.reduce(
    (acc, { CONTACTS, DEALS, LEADS }) => {
      const addAmount = Math.max(CONTACTS.length, DEALS.length, LEADS.length);
      return acc + (addAmount || 1);
    }, // 1 is for company itself
    0
  );
  let ws = {
    A1: { v: "#", s: HeaderColumnStyle },
    B1: { v: "COMPANY", s: HeaderColumnStyle },
    C1: { v: "RESPONSIBLE FOR COMPANY", s: HeaderColumnStyle },
    D1: { v: "CONTACT", s: HeaderColumnStyle },
    E1: { v: "RESPONSIBLE FOR CONTACT", s: HeaderColumnStyle },
    F1: { v: "LEAD", s: HeaderColumnStyle },
    G1: { v: "RESPONSIBLE FOR LEAD", s: HeaderColumnStyle },
    H1: { v: "DEAL", s: HeaderColumnStyle },
    I1: { v: "RESPONSIBLE FOR DEAL", s: HeaderColumnStyle },

    "!ref": `A1:I${totalAmountOfRows + 1}`,
    "!cols": [
      { width: 10 },
      { width: 55 },
      { width: 30 },
      { width: 55 },
      { width: 30 },
      { width: 55 },
      { width: 30 },
      { width: 55 },
      { width: 30 },
    ],
    "!rows": [{ hpt: 30 }, ...Array(totalAmountOfRows).fill({ hpt: 20 })],
  };

  const structuredData = companies.map(
    (
      { ID, TITLE, ASSIGNED_BY_ID, CONTACTS, LEADS, DEALS },
      index
    ): [
      string,
      [Company["ID"], Company["TITLE"]],
      ReturnType<typeof getUserNameById>,
      [Contact["ID"], string][],
      ReturnType<typeof getUserNameById>[],
      [Lead["ID"], Lead["TITLE"]][],
      ReturnType<typeof getUserNameById>[],
      [Deal["ID"], Deal["TITLE"]][],
      ReturnType<typeof getUserNameById>[]
    ] => {
      return [
        String(index + 1),
        [ID, TITLE],
        getUserNameById(users, ASSIGNED_BY_ID),
        CONTACTS.map(({ ID, NAME, LAST_NAME }) => [ID, `${NAME} ${LAST_NAME}`]), // Contact
        CONTACTS.map(({ ASSIGNED_BY_ID }) =>
          getUserNameById(users, ASSIGNED_BY_ID)
        ),
        LEADS.map(({ ID, TITLE }) => [ID, TITLE]),
        LEADS.map(({ ASSIGNED_BY_ID }) =>
          getUserNameById(users, ASSIGNED_BY_ID)
        ),
        DEALS.map(({ ID, TITLE }) => [ID, TITLE]),
        DEALS.map(({ ASSIGNED_BY_ID }) =>
          getUserNameById(users, ASSIGNED_BY_ID)
        ),
      ];
    }
  );

  function* fillCells() {
    let startRowIndex = 2;
    let lowestRowIndex = 2;
    let currentRowIndex: number;
    const columnLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    const linkTypeMap: {
      [key: number]: string;
    } = {
      3: "contact",
      5: "lead",
      7: "deal",
    };

    for (const company of structuredData) {
      let columnIndex = 0;
      let id, title;
      for (const rawCellData of company) {
        currentRowIndex = startRowIndex;
        let toYield: any;
        switch (columnIndex) {
          case 1: // company title
            [id, title] = rawCellData;
            toYield = {
              v: title,
              l: {
                Target: `${process.env.REACT_APP_B24_ADDRESS}crm/company/details/${id}/`,
              },
              s: {
                font: {
                  underline: true,
                  color: { rgb: "CC2581FF" },
                },
              },
            };
            break;
          case 3:
          case 5:
          case 7:
            toYield = (rawCellData as []).map(([id, title]: any) => ({
              v: title,
              l: {
                Target: `${process.env.REACT_APP_B24_ADDRESS}crm/${linkTypeMap[columnIndex]}/details/${id}/`,
              },
              s: {
                font: {
                  underline: true,
                  color: { rgb: "CC2581FF" },
                },
              },
            }));
            break;
          default:
            toYield = { v: rawCellData };
        }

        if (Array.isArray(toYield)) {
          if (toYield.length) {
            // has related entities
            for (const relatedEntityCell of toYield) {
              yield {
                [`${columnLetters[columnIndex]}${currentRowIndex}`]:
                  relatedEntityCell,
              };
              currentRowIndex += 1;
            }
          } else {
            // no related entities in Company, but should render empty cell for the company row
            yield {
              [`${columnLetters[columnIndex]}${currentRowIndex}`]: { v: "-" },
            };
            currentRowIndex += 1;
          }
        } else {
          // toYield is not array
          if (Array.isArray(toYield.v)) {
            if (toYield.v.length) {
              for (const val of toYield.v) {
                yield {
                  [`${columnLetters[columnIndex]}${currentRowIndex}`]: {
                    v: val,
                  },
                };
                currentRowIndex += 1;
              }
            } else {
              yield {
                [`${columnLetters[columnIndex]}${currentRowIndex}`]: { v: "-" },
              };
              currentRowIndex += 1;
            }
          } else {
            yield {
              [`${columnLetters[columnIndex]}${currentRowIndex}`]: toYield,
            };
          }
        }
        // end toYield is array

        if (lowestRowIndex < currentRowIndex) {
          lowestRowIndex = currentRowIndex;
        }
        columnIndex += 1;
      } // end of company
      startRowIndex = lowestRowIndex;
    } // end of all companies
  }

  // @ts-ignore
  for (const cell of fillCells()) {
    ws = { ...ws, ...cell };
  }

  const filename = `Different_contacts,leads,deals_of${
    name ? `_${name}` : ""
  }_${dayjs().format("YYYY-MM-DD-HHmmss")}.xlsx`;

  const wb = {
    Props: {
      Title: "Related company entities",
      Subject: "XMT",
      Author: "@bootoffav",
      CreatedDate: new Date(),
    },
    SheetNames: ["Related company entities"],
    Sheets: { "Related company entities": ws },
  };

  return {
    filename,
    content: wb,
  };
};

export default generateExcelFileStructure;
