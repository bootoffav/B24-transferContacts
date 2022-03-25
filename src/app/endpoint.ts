import { stringify } from "qs";

const fetchCountryList = async function () {
  const {
    REACT_APP_B24_ENDPOINT: endpoint,
    REACT_APP_B24_USER_ID: userId,
    REACT_APP_B24_WEBHOOK_TOKEN: webhookToken,
    REACT_APP_B24_COUNTRY_FIELD_ID: countryFieldId,
  } = process.env;
  return await fetch(
    `${endpoint}${userId}/${webhookToken}/crm.company.userfield.get?` +
      stringify({ ID: countryFieldId })
  )
    .then((r) => r.json())
    .then((response) => {
      if ("error" in response && "error_description" in response) {
        throw new Error();
      }
      const {
        result: { LIST: countries },
      } = response;
      return countries.map((country: any) => ({
        value: country.VALUE,
        id: country.ID,
      }));
    });
};

export { fetchCountryList };
