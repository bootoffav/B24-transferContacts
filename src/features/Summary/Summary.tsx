import { Link } from "react-router-dom";
import { setViewMode, ViewMode } from "features/List/listSlice";
import type { ListSliceState } from "features/List/listSlice";
import { Transfer } from "types";
import { useAppSelector } from "app/hooks";
import { getUserNameById } from "utils/users";
import { getEntityTitle } from "app/helpers";
import { store } from "app/store";
import companiesByUser from "utils/companiesByUser";
import CountrySplitEmployee from "./CountrySplitEmployee";
import { Stage } from "app/commonSlice";

export default function Summary() {
  const { selectType, stage } = useAppSelector(({ common }) => common);
  const { includeDeals, includeLeads } = useAppSelector(
    ({ options }) => options
  );

  return stage === Stage.scanFinished ? (
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
          <tbody>{formSummaryBody()}</tbody>
        </table>
        {selectType === "companyCountryList" && <CountrySplitEmployee />}
      </div>
    </div>
  ) : (
    <></>
  );
}

/**
 * Represents a body of Summary.
 */
function formSummaryBody() {
  const {
    common: { chosenId },
    options: { includeDeals, includeLeads },
  } = store.getState();

  const customLinkHandler = (
    customViewEntityType: ListSliceState["customViewEntityType"],
    customViewUserId: ListSliceState["customViewId"]
  ) => {
    store.dispatch(
      setViewMode(ViewMode.custom, customViewEntityType, customViewUserId)
    );
  };

  return chosenId.map((id) => {
    const { entity, companiesAmount, contactAmount, leadAmount, dealAmount } =
      getSummaryTableRow(id);
    return (
      <tr key={entity}>
        <th>{entity}</th>
        <td onClick={() => customLinkHandler("COMPANIES", id)}>
          {companiesAmount ? <Link to="..">{companiesAmount}</Link> : 0}
        </td>
        <td onClick={() => customLinkHandler("CONTACTS", id)}>
          {contactAmount ? <Link to="..">{contactAmount}</Link> : 0}
        </td>
        {includeLeads && (
          <td onClick={() => customLinkHandler("LEADS", id)}>
            {leadAmount ? <Link to="..">{leadAmount}</Link> : 0}
          </td>
        )}
        {includeDeals && (
          <td onClick={() => customLinkHandler("DEALS", id)}>
            {dealAmount ? <Link to="..">{dealAmount}</Link> : 0}
          </td>
        )}
      </tr>
    );
  });
}

function getSummaryTableRow(entityId: number) {
  const {
    common: { selectType, users },
    company: { differentResponsibles, companies },
  } = store.getState();

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
