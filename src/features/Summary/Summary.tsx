import { Link } from "react-router-dom";
import { setViewMode, ViewMode } from "features/List/listSlice";
import type { ListSliceState } from "features/List/listSlice";
import { Transfer } from "types";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { getUserNameById } from "utils/users";
import { getEntityTitle } from "app/helpers";
import { store } from "app/store";
import companiesByUser from "utils/companiesByUser";

export default function Summary() {
  const { chosenId, selectType } = useAppSelector(({ common }) => common);
  const { includeDeals, includeLeads } = useAppSelector(
    ({ options }) => options
  );
  const dispatch = useAppDispatch();

  const customLinkHandler = (
    customViewEntityType: ListSliceState["customViewEntityType"],
    customViewUserId: ListSliceState["customViewUserId"]
  ) => {
    dispatch(
      setViewMode(ViewMode.custom, customViewEntityType, customViewUserId)
    );
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
            {chosenId.map((userId) => {
              const {
                entity,
                companiesAmount,
                contactAmount,
                leadAmount,
                dealAmount,
              } = getSummaryTableRow(userId);
              return (
                <tr key={entity}>
                  <th>{entity}</th>
                  <td onClick={() => customLinkHandler("COMPANIES", userId)}>
                    {companiesAmount ? (
                      <Link to="..">{companiesAmount}</Link>
                    ) : (
                      0
                    )}
                  </td>
                  <td onClick={() => customLinkHandler("CONTACTS", userId)}>
                    {contactAmount ? <Link to="..">{contactAmount}</Link> : 0}
                  </td>
                  {includeLeads && (
                    <td onClick={() => customLinkHandler("LEADS", userId)}>
                      {leadAmount ? <Link to="..">{leadAmount}</Link> : 0}
                    </td>
                  )}
                  {includeDeals && (
                    <td onClick={() => customLinkHandler("DEALS", userId)}>
                      {dealAmount ? <Link to="..">{dealAmount}</Link> : 0}
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
    const {
      CONTACTS: contactAmount,
      LEADS: leadAmount,
      DEALS: dealAmount,
    } = Object.values(differentResponsibles).reduce(
      (amounts, cur: Transfer[number]) => {
        Object.keys(cur).forEach((entityType) => {
          amounts[entityType] += cur[entityType as keyof typeof cur].length;
        });
        return amounts;
      },
      { CONTACTS: 0, LEADS: 0, DEALS: 0 }
    );
    return {
      entity: getEntityTitle(),
      companiesAmount: companies.length,
      contactAmount,
      leadAmount,
      dealAmount,
    };
  }

  return {
    entity: getUserNameById(users, entityId),
    companiesAmount: companiesByUser(companies, entityId).length,
    contactAmount: differentResponsibles[entityId]?.CONTACTS.length,
    leadAmount: differentResponsibles[entityId]?.LEADS.length,
    dealAmount: differentResponsibles[entityId]?.DEALS.length,
  };
}

export { getSummaryTableRow };
