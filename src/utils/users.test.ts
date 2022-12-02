import { User } from "types";
import { getUserNameById } from "./users";

const users: User[] = [
  {
    ID: 0,
    NAME: "none",
    LAST_NAME: "",
    ACTIVE: true,
    UF_DEPARTMENT: [0],
  },
  {
    ID: 5174,
    ACTIVE: true,
    NAME: "Adel`",
    LAST_NAME: "Amangeldinova",
    UF_DEPARTMENT: [8618],
  },
  {
    ID: 4116,
    ACTIVE: true,
    NAME: "Adela",
    LAST_NAME: "Apostol",
    UF_DEPARTMENT: [8496],
  },
  {
    ID: 5250,
    ACTIVE: true,
    NAME: "Adi",
    LAST_NAME: "Ilie",
    UF_DEPARTMENT: [8496],
  },
  {
    ID: 3134,
    ACTIVE: true,
    NAME: "Agnė",
    LAST_NAME: "Kašėtienė",
    UF_DEPARTMENT: [8636],
  },
];

describe("test user utils", function () {
  test("getUserNameById", function () {
    expect(getUserNameById(users, 4116)).toBe("A. Apostol");
  });
});
