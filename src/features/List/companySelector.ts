import { createSelector } from "@reduxjs/toolkit";
import { RootState, store } from "app/store";
import { ListSliceState, ViewMode } from "./listSlice";
import { COMPANY_COUNTRY_FIELD, LINKEDIN_ACCOUNT_FIELD } from "app/CONSTANTS";
import { companyHasDiffRespOfItsRelatedEntity } from "app/differentResponsibles";
import companiesByUser from "utils/companiesByUser";
import companiesByCountry from "utils/companiesByCountry";
import { Company } from "types";
import { CommonState } from "app/commonSlice";
import type { CompanyState } from "app/companySlice";
import { companiesByCountryAndUser } from "utils/companiesByCountryAndUser";

export const companySelector = createSelector(
  (
    { company, common, list }: RootState,
    viewModeArg?: ListSliceState["viewMode"]
  ) => ({
    companies: company.companies,
    companyCountryList: common.companyCountryList,
    contactCountryList: common.contactCountryList,
    selectType: common.selectType,
    list,
    viewModeArg,
  }),
  ({ companies, list, viewModeArg, selectType }) => {
    switch (viewModeArg || list.viewMode) {
      case ViewMode.diffs:
        return companies.filter(companyHasDiffRespOfItsRelatedEntity);
      case ViewMode.noCountries:
        return companiesHaveNoCountry(companies);
      case ViewMode.noCountriesInContacts:
        return companyNoCountryInContacts(companies);
      case ViewMode.withLinkedIn:
        return companies.filter((company) => company[LINKEDIN_ACCOUNT_FIELD]);
      case ViewMode.noEmail:
        return companies.filter(
          ({ HAS_EMAIL, CONTACTS }) =>
            HAS_EMAIL === "N" ||
            CONTACTS.some(({ HAS_EMAIL }) => HAS_EMAIL === "N")
        );
      case ViewMode.custom:
        return getCompaniesForCustomView(companies, selectType, list);
      default:
        return companies;
    }
  }
);

function companyNoCountryInContacts(companies: Company[]) {
  const { listOfCompaniesWithNoCountryInContact } = store.getState().company;
  return companies.filter(({ ID }) =>
    listOfCompaniesWithNoCountryInContact.includes(ID)
  );
}

function companiesHaveNoCountry(companies: Company[]) {
  return companies.filter(
    (company) =>
      !company[COMPANY_COUNTRY_FIELD] ||
      company[COMPANY_COUNTRY_FIELD] === "5734" //noneCompanyCountryId
  );
}

function getCompaniesForCustomView(
  companies: CompanyState["companies"],
  selectType: CommonState["selectType"],
  list: ListSliceState
) {
  if (selectType === "companyCountryList") {
    companies = list.customCountryAndUser
      ? companiesByCountryAndUser(companies, list.customViewId!)
      : companiesByCountry(companies, list.customViewId!);
  } else {
    companies = companiesByUser(companies, list.customViewId!);
  }

  return list.customViewEntityType === "COMPANIES"
    ? companies
    : companies.filter(companyHasDiffRespOfItsRelatedEntity);
}
export { companiesHaveNoCountry };
