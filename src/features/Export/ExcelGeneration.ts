import { RootState } from "app/store";
import dayjs from "dayjs";
import { emailMap } from "features/EmailFormChanger/EmailFormChanger";
import { User, Contact, Company } from "types";
import { getUserNameById } from "utils/users";

const linkedInField = process.env.REACT_APP_B24_LINKEDIN_ACCOUNT_FIELD || "";

const HeaderColumnStyle = {
  alignment: {
    horizontal: "center",
  },
  font: {
    sz: 14,
    bold: true,
  },
};

const emptyCellPlaceholder = {
  v: "-",
};

type structuredDataType = [
  string,
  [Company["ID"], Company["TITLE"]][],
  [Contact["ID"], string][],
  Contact["EMAILS"][number]["VALUE"][][],
  ReturnType<typeof getUserNameById>
];

function* fillCells(structuredData: structuredDataType[]) {
  let startRowIndex = 2;
  let lowestRowIndex = 2;
  let currentRowIndex: number;
  const columnLetters = ["A", "B", "C", "D", "E"];
  const linkType = new Map([
    [1, "company"],
    [2, "contact"],
  ]);

  for (const row of structuredData) {
    let columnIndex = 0;
    for (const rawCellData of row) {
      currentRowIndex = startRowIndex;
      let toYield: any;
      switch (columnIndex) {
        case 1:
        case 2:
          toYield = (rawCellData as []).map(
            // eslint-disable-next-line
            ([id, title]: [string, string]) => ({
              v: title,
              l: {
                Target: `${process.env.REACT_APP_B24_ADDRESS}crm/${linkType.get(
                  columnIndex
                )}/details/${id}/`,
              },
              s: {
                font: {
                  underline: true,
                  color: { rgb: "CC2581FF" },
                },
              },
            })
          );
          break;
        case 3:
          toYield = (rawCellData as []).map((emails: []) => {
            return emails.map((email) => ({
              v: email,
            }));
          });
          break;
        default:
          toYield = [{ v: rawCellData }];
      }

      for (let j = 0; j < toYield.length; j++) {
        // emails case
        if (columnIndex === 3) {
          if (toYield[j].length === 0) {
            yield {
              [`${columnLetters[columnIndex]}${currentRowIndex}`]:
                emptyCellPlaceholder,
            };
            currentRowIndex += 1;
            continue;
          }
          for (const v of toYield[j]) {
            yield {
              [`${columnLetters[columnIndex]}${currentRowIndex}`]: v,
            };
            currentRowIndex += 1;
          }
          continue;
        }

        // contact case
        let addToRow = 0;
        if (columnIndex === 2) {
          try {
            if (row[3][j - 1].length > 1) {
              addToRow = row[3][j - 1].length - 1;
            }
          } catch {}
        }
        yield {
          [`${columnLetters[columnIndex]}${currentRowIndex + addToRow}`]:
            toYield[j],
        };

        currentRowIndex += 1;
      }

      if (lowestRowIndex < currentRowIndex) {
        lowestRowIndex = currentRowIndex;
      }
      columnIndex += 1;
    } // end of company
    startRowIndex = lowestRowIndex;
  } // end of all companies
}

const generateExcelFileStructureForTransfer = (
  companies: RootState["company"]["companies"],
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
    C1: { v: "CONTACT", s: HeaderColumnStyle },
    D1: { v: "CONTACT EMAILS", s: HeaderColumnStyle },
    E1: { v: "RESPONSIBLE FOR COMPANY", s: HeaderColumnStyle },
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
    ({ ID, TITLE, ASSIGNED_BY_ID, CONTACTS }, index): structuredDataType => {
      return [
        String(index + 1),
        [[ID, TITLE]],
        CONTACTS.map(({ ID, NAME, LAST_NAME }) => [ID, `${NAME} ${LAST_NAME}`]), // Contact
        CONTACTS.map(({ EMAILS }) =>
          EMAILS.length
            ? EMAILS.map(
                ({ VALUE, VALUE_TYPE }) =>
                  `${VALUE} (${emailMap.get(VALUE_TYPE)})`
              )
            : []
        ),
        getUserNameById(users, ASSIGNED_BY_ID),
      ];
    }
  );

  for (const cell of fillCells(structuredData)) {
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

function generateExcelFileStructureLinkedInOnly(
  companies: RootState["company"]["companies"],
  name: string
) {
  const totalAmountOfRows = companies.length;
  let ws = {
    A1: { v: "#", s: HeaderColumnStyle },
    B1: { v: "COMPANY", s: HeaderColumnStyle },
    C1: { v: "LINKEDIN", s: HeaderColumnStyle },
    "!ref": `A1:C${totalAmountOfRows + 1}`,
    "!cols": [{ width: 10 }, { width: 55 }, { width: 30 }],
    "!rows": [{ hpt: 30 }, ...Array(totalAmountOfRows).fill({ hpt: 20 })],
  };

  const structuredData = companies.map(({ ID, TITLE, ...company }, index) => {
    // @ts-ignore
    return [[[ID, TITLE]], company[linkedInField]];
  });

  const columnLetters = ["A", "B"];
  structuredData.forEach((row, idx) => {
    // const cu
    for (const )
    ws = {

    }
  });


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
}

export {
  generateExcelFileStructureForTransfer,
  generateExcelFileStructureLinkedInOnly,
};
