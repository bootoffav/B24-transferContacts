import { hideModal, setContactIdForEmails } from "app/commonSlice";
import { fetchContactEmails, updateContactEmails } from "app/endpoint";
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
        <div className={`box${loading ? " has-text-centered" : ""}`}>
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

type ValueType = "HOME" | "WORK" | "MAILING" | "OTHER";

function EmailPresenter(props: { emails: Contact["EMAIL"][] }) {
  const [saving, setSaving] = useState(false);
  const [emails, setEmails] = useState(props.emails);
  const reduxDispatch = useAppDispatch();
  const contactIdForEmails = useAppSelector(
    ({ common: { contactIdForEmails } }) => contactIdForEmails
  );

  return (
    <>
      <ul>
        {emails.map((email) => (
          <li key={email.ID} className="columns">
            <span className="column">{email.VALUE}</span>
            <div className="column">
              <div className="select is-small">
                <select
                  value={email.VALUE_TYPE}
                  onChange={({ target: { value } }) => {
                    setEmails((emails) => {
                      const idx = emails.findIndex(({ ID }) => ID === email.ID);
                      const newEmails = [...emails];
                      newEmails[idx] = {
                        ...emails[idx],
                        VALUE_TYPE: value as ValueType,
                      };
                      return newEmails;
                    });
                  }}
                >
                  {[...emailMap.entries()].map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        className={`columns column mx-auto button is-success is-rounded mt-4 ${
          saving ? "is-loading" : ""
        }`}
        onClick={() => {
          setSaving(true);
          updateContactEmails(contactIdForEmails as number, emails).then(() => {
            reduxDispatch(setContactIdForEmails(undefined));
            reduxDispatch(hideModal(true));
            setSaving(false);
          });
        }}
      >
        Save
      </button>
    </>
  );
}
