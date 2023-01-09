import { Company, Transfer } from "types";
import { useAppSelector } from "app/hooks";
import { getUserNameById } from "utils/users";
import { getEntityTitle } from "app/helpers";
import { store } from "app/store";

function findCompaniesByUser(companies: Company[], userId: number) {
  return companies.filter(({ ASSIGNED_BY_ID }) => +ASSIGNED_BY_ID === userId);
}

export default function Summary() {
  const { chosenId, selectType } = useAppSelector(({ common }) => common);
  const { includeDeals, includeLeads } = useAppSelector(
    ({ options }) => options
  );

  return (
    <div className="column is-half is-offset-one-quarter">
      <table className="table is-fullwidth">
        <thead data-testid="thead">
          <tr>
            <th>
              {selectType === "companyCountryList" ? "Country" : "Manager"}
            </th>
            <th>Companies</th>
            <th>diff. responsible for contacts</th>
            {includeLeads && <th>diff. responsible for leads</th>}
            {includeDeals && <th>diff. responsible for deals</th>}
          </tr>
        </thead>
        <tbody>
          {chosenId.map((entityId) => {
            const { entity, companiesOfEntity, CONTACTS, LEADS, DEALS } =
              getSummaryTableRow(entityId);
            return (
              <tr key={entity}>
                <th>{entity}</th>
                <td>{companiesOfEntity.length}</td>
                <td>{CONTACTS.length}</td>
                {includeLeads && <td>{LEADS.length}</td>}
                {includeDeals && <td>{DEALS.length}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function getSummaryTableRow(entityId: number) {
  const { selectType, users } = store.getState().common;
  const { differentResponsibles, companies } = store.getState().company;
  if (selectType === "companyCountryList") {
    return {
      entity: getEntityTitle(),
      companiesOfEntity: companies,
      ...Object.values(differentResponsibles).reduce(
        (acc, cur: Transfer[number]) => {
          for (const prop in cur) {
            acc[prop] = acc[prop].concat(cur[prop as keyof typeof cur]);
          }
          return acc;
        },
        { CONTACTS: [], LEADS: [], DEALS: [] }
      ),
    };
  }

  return {
    entity: getUserNameById(users, entityId),
    companiesOfEntity: findCompaniesByUser(companies, entityId),
    CONTACTS: differentResponsibles[entityId]?.CONTACTS || [],
    LEADS: differentResponsibles[entityId]?.LEADS || [],
    DEALS: differentResponsibles[entityId]?.DEALS || [],
  };
}

export { findCompaniesByUser, getSummaryTableRow };
