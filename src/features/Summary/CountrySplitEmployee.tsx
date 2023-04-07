import { useAppSelector } from "app/hooks";
import type { Company } from "types";
import { getUserNameById } from "utils/users";
import { store } from "app/store";
import { customLinkHandler } from "./utils";
import { Link } from "react-router-dom";

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
            {/* <th>diff. responsible for contacts</th> */}
            {/* {includeLeads && <th>diff. responsible for leads</th>}
            {includeDeals && <th>diff. responsible for deals</th>} */}
          </tr>
        </thead>
        <tbody>
          {Object.entries(splitByEmployee).map(([id, companies]) => {
            // const {
            //   entity,
            //   companiesAmount,
            //   contactAmount,
            //   leadAmount,
            //   dealAmount,
            // } = getSummaryTableRow(+emp);
            return (
              <tr key={id}>
                <td>{getUserNameById(users, +id)}</td>
                <td onClick={() => customLinkHandler("COMPANIES", +id, true)}>
                  {companies.length ? (
                    <Link to="..">{companies.length}</Link>
                  ) : (
                    0
                  )}
                </td>
                {/* <td onClick={() => customLinkHandler("CONTACTS", +id, true)}>
                  <Link to="..">test</Link>
                </td> */}
                {/* {includeLeads && <td>leadAmount</td>}
                {includeDeals && <td>dealAmount</td>} */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
