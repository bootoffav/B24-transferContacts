import type { User } from "../types";

// sort
const sort = (users: any) => {
  return users.sort((a: User, b: User) => {
    if (a.NAME > b.NAME) return 1;
    if (a.NAME < b.NAME) return -1;
    return 0;
  });
};

// divide users: active ones will go first, dismissed will go last
const splitActiveDismissed = (users: User[]) => {
  let activeUsers: User[] = [];
  let dismissedUsers: User[] = [];
  users.forEach((user: User) => {
    user.ACTIVE ? activeUsers.push(user) : dismissedUsers.push(user);
  });

  return [...activeUsers, ...dismissedUsers];
};

function getUserNameById(users: User[], id: User["ID"]): string {
  const found = users.find(({ ID }: User) => +ID === +id);
  return found ? `${found.NAME[0]}. ${found.LAST_NAME}` : "unknown";
}

export { sort, splitActiveDismissed, getUserNameById };
