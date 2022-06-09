import { fetchCompanies, fetchCompanyContacts } from "app/endpoint";
import {
  setCompanies,
  setDifferentResponsibles,
  setTotalAmount,
  setProcessedAmount,
} from "app/companySlice";
import getDifferentContactResponsibles from "app/differentContactResponsibles";
import { Company } from "types";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { setStage } from "app/commonSlice";
import { SyntheticEvent, useState } from "react";

export default function GetCompanies() {
  const [state, setState] = useState<"idle" | "processing">("idle");
  const dispatch = useAppDispatch();
  const [chosenId, selectType] = useAppSelector(({ common }) => [
    common.chosenId,
    common.selectType,
  ]);

  const clickHandler = async ({ target }: SyntheticEvent) => {
    if (chosenId) {
      // if (chosenId === "" || chosenId === "0") {

      // }

      if ((target as HTMLButtonElement).innerHTML === "STOP") {
        window.aborted = true;
        return;
      }
      // set up initital state
      setState("processing");
      dispatch(setProcessedAmount(0));
      dispatch(setTotalAmount(0));
      dispatch(setStage("gettingData"));

      // get companies
      const companies = await fetchCompanies(chosenId, selectType);
      dispatch(setTotalAmount(companies.length));

      //working on company contacts
      let companiesWithContacts: Company[] = [];
      for await (const company of getCompaniesWithContacts(companies)) {
        companiesWithContacts = [...companiesWithContacts, company];
        dispatch(setProcessedAmount(1));
      }

      dispatch(setCompanies(companiesWithContacts));
      dispatch(setStage("scanFinished"));
      const differentResponsibles = getDifferentContactResponsibles(
        companiesWithContacts
      );
      dispatch(setDifferentResponsibles(differentResponsibles));
      setState("idle");
      return;
    }
    alert(`choose ${selectType} first`);
  };

  return (
    <button
      className={`button ${state === "idle" ? "is-primary" : "is-danger"}`}
      onClick={clickHandler}
    >
      {state === "idle" ? "Get companies" : "STOP"}
    </button>
  );
}

async function* getCompaniesWithContacts(
  companies: Company[]
): AsyncGenerator<Company> {
  for (let company of companies) {
    if (window.aborted) {
      window.aborted = false;
      return;
    }
    await (() => new Promise((r) => setTimeout(r, 500)))();
    yield {
      ...company,
      CONTACTS: await fetchCompanyContacts(company.ID),
    };
  }
}
