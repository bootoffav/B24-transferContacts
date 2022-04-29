import { useSelector, useDispatch } from "react-redux";
import { addUsers, setChosenId } from "../../app/commonSlice";
import type { User } from "../../types";
import { useEffect } from "react";
import { fetchUsers } from "../../app/endpoint";

function UserSelector() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const users = await fetchUsers();
      dispatch(addUsers(users));
    })();
  }, [dispatch]);

  const users = useSelector<unknown, User[]>(
    (state: any) => state.common.users
  );

  return (
    <div className="control has-icons-left is-disabled">
      <div className={`select ${users.length ? "" : "is-loading"}`}>
        <select
          onChange={({ target }) => {
            dispatch(setChosenId(target.value));
          }}
        >
          {users.map(({ NAME, LAST_NAME, ID, ACTIVE }) => {
            return (
              <option key={ID} value={ID} style={{ color: "green" }}>
                {`${NAME} ${LAST_NAME} ${ACTIVE ? "" : " - dismissed"}`}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default UserSelector;
