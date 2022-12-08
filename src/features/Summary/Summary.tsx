import { Company } from "types";
import { useAppSelector } from "app/hooks";
import { getUserNameById } from "utils/users";

function findCompaniesByUser(companies: Company[], userId: number) {
  return companies.filter(({ ASSIGNED_BY_ID }) => +ASSIGNED_BY_ID === userId);
}

export default function Summary() {
  const { chosenId, users } = useAppSelector(({ common }) => common);
  const { companies, differentResponsibles } = useAppSelector(
    ({ company }) => company
  );

  return (
    <div className="column is-half is-offset-one-quarter">
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Manager</th>
            <th>Companies</th>
            <th>diff. responsible for contacts</th>
            <th>diff. responsible for leads</th>
            <th>diff. responsible for deals</th>
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
                <td>{differentResponsibles[userId]?.CONTACTS.length}</td>
                <td>{differentResponsibles[userId]?.LEADS.length}</td>
                <td>{differentResponsibles[userId]?.DEALS.length}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { findCompaniesByUser };
