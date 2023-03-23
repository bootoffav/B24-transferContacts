import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import {
  viewModeNoCountries,
  viewModeWithLinkedIn,
  viewModeDiffs,
  viewModeCustom,
  ListSliceState,
  viewModeNoEmail,
} from "./listSlice";
import { CONTACT_COUNTRY_FIELD, LINKEDIN_ACCOUNT_FIELD } from "app/CONSTANTS";
import { companyHasDiffRespOfItsRelatedEntity } from "app/differentResponsibles";
import companiesByUser from "utils/companiesByUser";
import { Company, Country } from "types";

export const companySelector = createSelector(
  (
    { company, common, list }: RootState,
    viewModeArg?: ListSliceState["viewMode"]
  ) => ({
    companies: company.companies,
    companyCountryList: common.companyCountryList,
    contactCountryList: common.contactCountryList,
    list,
    viewModeArg,
  }),
  ({ companies, list, contactCountryList, viewModeArg }) => {
    switch (viewModeArg || list.viewMode) {
      case viewModeDiffs:
        return companies.filter(companyHasDiffRespOfItsRelatedEntity);
      case viewModeNoCountries:
        return companyNoCountryView(companies, contactCountryList);
      case viewModeWithLinkedIn:
        return companies.filter((company) => company[LINKEDIN_ACCOUNT_FIELD]);
      case viewModeNoEmail:
        return companies.filter(
          ({ HAS_EMAIL, CONTACTS }) =>
            HAS_EMAIL === "N" ||
            CONTACTS.some(({ HAS_EMAIL }) => HAS_EMAIL === "N")
        );
      case viewModeCustom:
        if (list.customViewEntityType === "COMPANIES")
          return companiesByUser(companies, list.customViewUserId!);
        return customViewCompanies(companies, list.customViewUserId);
      default:
        return companies;
    }
  }
);

function companyNoCountryView(
  companies: Company[],
  contactCountryList?: Country[]
) {
  const noneCountryId =
    contactCountryList?.find((country) => country.value === "none")?.ID ||
    "5732";

  return companies.filter(
    ({ CONTACTS }) =>
      !CONTACTS.map((contact) => (contact as any)[CONTACT_COUNTRY_FIELD]).every(
        (countryId) => countryId && countryId !== noneCountryId
      )
  );
}

function customViewCompanies(
  companies: Company[],
  userId: ListSliceState["customViewUserId"]
) {
  return (userId ? companiesByUser(companies, userId) : companies).filter(
    companyHasDiffRespOfItsRelatedEntity
  );
}

export { companyNoCountryView };
