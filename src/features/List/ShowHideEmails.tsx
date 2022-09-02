import { useState } from "react";

export default function ShowHideEmails() {
  const onClick = () => {
    setEmailsColumnHidden(!emailsColumnHidden);
  };
  const [emailsColumnHidden, setEmailsColumnHidden] = useState(true);
  return (
    <span onClick={onClick}>
      <i className="fas fa-plus" />{" "}
      <em className="is-underlined">
        {emailsColumnHidden ? "show" : "hide"} emails
      </em>
    </span>
  );
}
