import { getUserNameById } from "./users";
import { users } from "tests/mocks/users";

describe("test user utils", function () {
  test("getUserNameById", function () {
    expect(getUserNameById(users, 4116)).toBe("A. Apostol");
  });
});
