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

export default function EmailFormChanger() {
  const modalHidden = useAppSelector(
    ({ common: { modalHidden } }) => modalHidden
  );
  const contactIdForEmails = useAppSelector(
    ({ common: { contactIdForEmails } }) => contactIdForEmails
  );
  const dispatch = useAppDispatch();
  const [emails, setEmails] = useState<Contact["EMAIL"][] | undefined>();
  const [saving, toggleSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (contactIdForEmails) {
        const emails = await fetchContactEmails(contactIdForEmails);
        setEmails(emails);
      }
    })();
  }, [contactIdForEmails, dispatch]);

  const onModalClose = () => {
    dispatch(hideModal(true));
    dispatch(setContactIdForEmails(undefined));
    setEmails(undefined);
  };
  return (
    <div className={`modal ${modalHidden ? "" : "is-active"}`}>
      <div className="modal-background" onClick={onModalClose}></div>
      <div className="modal-content">
        <div className="box">
          {emails ? (
            emails.length ? (
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
                                const idx = emails!.findIndex(
                                  ({ ID }) => ID === email.ID
                                );
                                const nextEmails = [...emails!];
                                nextEmails[idx] = {
                                  ...emails![idx],
                                  VALUE_TYPE: value as ValueType,
                                };
                                return nextEmails;
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
                    toggleSaving((saving) => !saving);
                    contactIdForEmails &&
                      updateContactEmails(contactIdForEmails, emails).then(
                        () => {
                          onModalClose();
                          toggleSaving((saving) => !saving);
                        }
                      );
                  }}
                >
                  Save
                </button>
              </>
            ) : (
              <div className="has-text-centered is-size-5">
                Contact has no emails
              </div>
            )
          ) : (
            <div className="has-text-centered">
              <ClipLoader />
            </div>
          )}
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onModalClose}
      ></button>
    </div>
  );
}

type ValueType = "HOME" | "WORK" | "MAILING" | "OTHER";
