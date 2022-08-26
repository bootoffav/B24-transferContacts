import { hideModal, setContactIdForEmails } from "app/commonSlice";
import { fetchContactEmails } from "app/endpoint";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Contact } from "types";

const emailMap = new Map([
  ["HOME", "Home"],
  ["WORK", "Work"],
  ["MAILING", "For newsletters"],
  ["OTHER", "Other"],
]);

export default function EmailHandler() {
  const modalHidden = useAppSelector(
    ({ common: { modalHidden } }) => modalHidden
  );
  const contactIdForEmails = useAppSelector(
    ({ common: { contactIdForEmails } }) => contactIdForEmails
  );
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<Contact["EMAIL"][]>([]);

  useEffect(() => {
    (async () => {
      if (contactIdForEmails) {
        const emails = await fetchContactEmails(contactIdForEmails);
        setEmails(emails);
        setLoading(false);
      }
    })();

    return () => {
      dispatch(setContactIdForEmails(undefined));
      setEmails([]);
    };
  }, [contactIdForEmails, dispatch]);

  return (
    <div className={`modal ${modalHidden ? "" : "is-active"}`}>
      <div
        className="modal-background"
        onClick={() => dispatch(hideModal(true))}
      ></div>
      <div className="modal-content">
        <div className={`box ${loading ? "has-text-centered" : ""}`}>
          {emails.length ? (
            <EmailPresenter emails={emails} />
          ) : (
            <ClipLoader loading={true} />
          )}
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={() => dispatch(hideModal(true))}
      ></button>
    </div>
  );
}

function EmailPresenter({ emails }: { emails: Contact["EMAIL"][] }) {
  const [saving, setSaving] = useState(false);
  return (
    <>
      <ul>
        {emails.map((email) => (
          <li key={email.ID} className="is-flex is-justify-content-start">
            <span>{email.VALUE}</span>
            <span>{emailMap.get(email.VALUE_TYPE)}</span>
          </li>
        ))}
      </ul>
      <button
        className={`button is-success ${
          saving ? "is-loading" : ""
        } is-rounded mt-2`}
        onClick={() => {
          setSaving(true);
          console.log("save to b24");
        }}
      >
        Save (no logic applied)
      </button>
    </>
  );
}
