import { useAppSelector } from "app/hooks";
import type { Company } from "types";
import { getUserNameById } from "utils/users";
import { store } from "app/store";

type SplittedByEmployee = {
  [key: number]: Company[];
};

export default function CountrySplitEmployee() {
  const {
    // includeDeals, includeLeads,
    companies,
  } = useAppSelector(
    ({ options: { includeDeals, includeLeads }, company: { companies } }) => ({
      includeDeals,
      includeLeads,
      companies,
    })
  );

  const { users } = store.getState().common;

  const splitByEmployee = companies.reduce(
    (acc: SplittedByEmployee, c) => ({
      ...acc,
      [c.ASSIGNED_BY_ID]: [...(acc[c.ASSIGNED_BY_ID] ?? []), c],
    }),
    {}
  );

  return (
    <>
      <hr />
      <p className="is-size-5 has-text-centered">Splitted by employees</p>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Manager</th>
            <th>Companies</th>
            {/* <th>diff. responsible for contacts</th>
            {includeLeads && <th>diff. responsible for leads</th>}
            {includeDeals && <th>diff. responsible for deals</th>} */}
          </tr>
        </thead>
        <tbody>
          {Object.entries(splitByEmployee).map(([emp, companies]) => {
            // const {
            //   entity,
            //   companiesAmount,
            //   contactAmount,
            //   leadAmount,
            //   dealAmount,
            // } = getSummaryTableRow(+emp);
            return (
              <tr>
                <td>{getUserNameById(users, +emp)}</td>
                <td>{companies.length}</td>
                {/* <td>{contactAmount}</td>
                {includeLeads && <td>leadAmount</td>}
                {includeDeals && <td>dealAmount</td>} */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
