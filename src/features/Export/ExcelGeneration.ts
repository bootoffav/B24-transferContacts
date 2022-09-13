import { RootState } from "app/store";
import dayjs from "dayjs";
import { emailMap } from "features/EmailFormChanger/EmailFormChanger";
import { User, Contact, Company } from "types";

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
    C1: { v: "CONTACT", s: HeaderColumnStyle },
    D1: { v: "CONTACT EMAILS", s: HeaderColumnStyle },
    "!ref": `A1:D${totalAmountOfRows + 1}`,
    "!cols": [{ width: 10 }, { width: 55 }, { width: 30 }, { width: 55 }],
    "!rows": [{ hpt: 30 }, ...Array(totalAmountOfRows).fill({ hpt: 20 })],
  };

  const structuredData = companies.map(
    (
      { ID, TITLE, ASSIGNED_BY_ID, CONTACTS, LEADS, DEALS },
      index
    ): [
      string,
      [Company["ID"], Company["TITLE"]][],
      [Contact["ID"], string][],
      Contact["EMAILS"][number]["VALUE"][][]
    ] => {
      return [
        String(index + 1),
        [[ID, TITLE]],
        CONTACTS.map(({ ID, NAME, LAST_NAME }) => [ID, `${NAME} ${LAST_NAME}`]), // Contact
        CONTACTS.map(
          ({ EMAILS }) =>
            EMAILS.map(
              ({ VALUE, VALUE_TYPE }) =>
                `${VALUE} (${emailMap.get(VALUE_TYPE)})`
            ) //to-do refactor to align with types
        ),
      ];
    }
  );

  function* fillCells() {
    let startRowIndex = 2;
    let lowestRowIndex = 2;
    let currentRowIndex: number;
    const columnLetters = ["A", "B", "C", "D"];
    const linkType = new Map([
      [1, "company"],
      [2, "contact"],
    ]);

    for (const company of structuredData) {
      let columnIndex = 0;
      for (const rawCellData of company) {
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
                  Target: `${
                    process.env.REACT_APP_B24_ADDRESS
                  }crm/${linkType.get(columnIndex)}/details/${id}/`,
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
            toYield = { v: rawCellData };
        }

        if (Array.isArray(toYield)) {
          if (toYield.length) {
            // has related entities
            for (const relatedEntityCell of toYield) {
              // case for contactEmails
              if (Array.isArray(relatedEntityCell)) {
                for (const email of relatedEntityCell) {
                  yield {
                    [`${columnLetters[columnIndex]}${currentRowIndex}`]: email,
                  };
                  currentRowIndex += 1;
                }
              } else {
                yield {
                  [`${columnLetters[columnIndex]}${currentRowIndex}`]:
                    relatedEntityCell,
                };
                currentRowIndex += 1;
              }
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
