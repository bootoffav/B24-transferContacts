import { Company, Contact, Country, TransferCountry } from "types";
import { COMPANY_COUNTRY_FIELD, CONTACT_COUNTRY_FIELD } from "./CONSTANTS";

export default function getContactsNoCountries(
  companies: Company[],
  companyCountryList: Country[],
  contactCountryList: Country[]
): TransferCountry {
  const transferCountry: TransferCountry = {};

  function addContactToTransferCountryList(
    companyCountry: string,
    contact: Contact
  ) {
    const contactCountryId = contactCountryList.find(
      ({ value }) => value === companyCountry
    )?.ID;
    if (contactCountryId) {
      transferCountry[contactCountryId] = transferCountry[contactCountryId]
        ? [...transferCountry[contactCountryId], contact.ID]
        : [contact.ID];
    }
  }

  companies.forEach((company) => {
    const companyCountry = companyCountryList.find(
      ({ ID }) => ID === company[COMPANY_COUNTRY_FIELD]
    )?.value;

    for (const contact of company.CONTACTS) {
      if (contact[CONTACT_COUNTRY_FIELD] === null) {
        addContactToTransferCountryList(companyCountry as string, contact);
      }

      const contactCountry = contactCountryList.find(
        ({ ID }) => ID === contact[CONTACT_COUNTRY_FIELD]
      )?.value;

      if (contactCountry === "none") {
        addContactToTransferCountryList(companyCountry as string, contact);
      }
    }
  });

  return transferCountry;
}
