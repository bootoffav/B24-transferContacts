// @ts-nocheck
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { ListSliceState, ViewMode } from "./listSlice";
import {
  COMPANY_COUNTRY_FIELD,
  CONTACT_COUNTRY_FIELD,
  LINKEDIN_ACCOUNT_FIELD,
} from "app/CONSTANTS";
import { companyHasDiffRespOfItsRelatedEntity } from "app/differentResponsibles";
import companiesByUser from "utils/companiesByUser";
import companiesByCountry from "utils/companiesByCountry";
import { Company, Country } from "types";
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
  ({ companies, list, contactCountryList, viewModeArg, selectType }) => {
    switch (viewModeArg || list.viewMode) {
      case ViewMode.diffs:
        return companies.filter(companyHasDiffRespOfItsRelatedEntity);
      case ViewMode.noCountries:
        return companyNoCountryView(companies, contactCountryList);
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

function companyNoCountryView(
  companies: Company[],
  contactCountryList?: Country[]
) {
  const noneContactCountryId =
    contactCountryList?.find((country) => country.value === "none")?.ID ||
    "5732";

  function companyHasCountry(companyCountryId: string) {
    const noneCompanyCountryId = "5734";
    return companyCountryId && companyCountryId !== noneCompanyCountryId;
  }

  function allContactsOfCompanyHasContacts(contactsOfCompanyBeingChecked) {
    return contactsOfCompanyBeingChecked
      .map((contact) => (contact as any)[CONTACT_COUNTRY_FIELD])
      .every((countryId) => countryId && countryId !== noneContactCountryId);
  }

  return companies.filter(
    (company) =>
      !(
        // check for company country ID && check for companie's related contacts
        (
          companyHasCountry(company[COMPANY_COUNTRY_FIELD]) &&
          allContactsOfCompanyHasContacts(company.CONTACTS)
        )
      )
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
export { companyNoCountryView };
