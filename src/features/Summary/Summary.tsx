import { Link } from "react-router-dom";
import { setViewMode, viewModeCustom } from "features/List/listSlice";
import type { ListSliceState } from "features/List/listSlice";
import { Company, Transfer } from "types";
import { useAppSelector, useAppDispatch } from "app/hooks";
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
  const dispatch = useAppDispatch();

  const customLinkHandler = (
    customViewEntityType: ListSliceState["customViewEntityType"]
  ) => {
    dispatch(setViewMode({ viewMode: viewModeCustom, customViewEntityType }));
  };

  return (
    <div className="columns">
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
                  <td onClick={() => customLinkHandler("CONTACTS")}>
                    {CONTACTS.length ? (
                      <Link to="..">{CONTACTS.length}</Link>
                    ) : (
                      CONTACTS.length
                    )}
                  </td>
                  {includeLeads && (
                    <td onClick={() => customLinkHandler("LEADS")}>
                      <Link to="..">{LEADS.length}</Link>
                    </td>
                  )}
                  {includeDeals && (
                    <td onClick={() => customLinkHandler("DEALS")}>
                      <Link to="..">{DEALS.length}</Link>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getSummaryTableRow(entityId: number) {
  const { selectType, users } = store.getState().common;
  const { differentResponsibles, companies } = store.getState().company;
  if (selectType === "companyCountryList") {
    return {
      entity: getEntityTitle(),
      companiesAmount: companies.length,
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
    companiesAmount: findCompaniesByUser(companies, entityId),
    contactAmount: differentResponsibles[entityId]?.CONTACTS.length,
    leadAmount: differentResponsibles[entityId]?.LEADS.length,
    dealAmount: differentResponsibles[entityId]?.DEALS.length,
  };
}

export { findCompaniesByUser, getSummaryTableRow };
