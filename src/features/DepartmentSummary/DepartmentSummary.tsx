import { Company } from "types";
import { useAppSelector } from "app/hooks";
import { getUserNameById } from "utils/users";

function findCompaniesByUser(companies: Company[], userId: number) {
  return companies.filter(({ ASSIGNED_BY_ID }) => +ASSIGNED_BY_ID === userId);
}

export default function DepartmentSummary() {
  const { chosenId, users } = useAppSelector(({ common }) => common);
  const { companies } = useAppSelector(({ company }) => company);

  return (
    <div className="column is-half is-offset-one-quarter">
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>
              <abbr title="Responsible for company">Manager</abbr>
            </th>
            <th>Companies</th>
          </tr>
        </thead>
        <tbody>
          {chosenId.map((userId) => {
            const user = getUserNameById(users, userId);
            const companiesOfUser = findCompaniesByUser(companies, userId);
            return (
              <tr key={userId}>
                <th>{user}</th>
                <td>{companiesOfUser.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { findCompaniesByUser };
