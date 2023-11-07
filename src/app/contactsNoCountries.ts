import { Company, Contact, TransferCountry } from "types";
import { COMPANY_COUNTRY_FIELD, CONTACT_COUNTRY_FIELD } from "./CONSTANTS";
import { store } from "./store";

export default function getContactsNoCountries(): [TransferCountry, number[]] {
  const { companies } = store.getState().company;
  const { companyCountryList, contactCountryList } = store.getState().common;

  const transferCountry: TransferCountry = {};
  const companiesIdWithNoCountryInContact: Company["ID"][] = [];

  function addContactToTransferCountryList(
    companyCountry: string,
    contactId: Contact["ID"],
    companyId: Company["ID"]
  ) {
    const contactCountryId = contactCountryList.find(
      ({ value }) => value === companyCountry
    )?.ID;
    if (contactCountryId) {
      transferCountry[contactCountryId] = transferCountry[contactCountryId]
        ? [...transferCountry[contactCountryId], contactId]
        : [contactId];
      companiesIdWithNoCountryInContact.push(companyId);
    }
  }

  companies.forEach((company) => {
    const companyCountry = companyCountryList.find(
      ({ ID }) => ID === company[COMPANY_COUNTRY_FIELD]
    )?.value;

    for (const contact of company.CONTACTS) {
      if (contact[CONTACT_COUNTRY_FIELD] === null) {
        addContactToTransferCountryList(
          companyCountry as string,
          contact.ID,
          company.ID
        );
      }

      const contactCountry = contactCountryList.find(
        ({ ID }) => ID === contact[CONTACT_COUNTRY_FIELD]
      )?.value;

      if (contactCountry === "none") {
        addContactToTransferCountryList(
          companyCountry as string,
          contact.ID,
          company.ID
        );
      }
    }
  });

  return [transferCountry, companiesIdWithNoCountryInContact];
}
