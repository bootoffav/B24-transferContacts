import { changeField } from "app/endpoint";
import { useState } from "react";
import { Contact } from "types";
import styles from "./ChangeableField.module.css";
import { changeField as changeFieldInStore } from "app/companySlice";
import { useAppDispatch } from "app/hooks";
import { CONTACT_POSITION_FIELD, COMPANY_1CCODE_FIELD } from "app/CONSTANTS";

interface ChangeableFieldProps {
  value: string;
  id: Contact["ID"];
  entity: "contact" | "company";
  field: typeof CONTACT_POSITION_FIELD | typeof COMPANY_1CCODE_FIELD;
}

enum SaveResult {
  success,
  fail,
  idle,
}

export default function ChangeableField(props: ChangeableFieldProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(props.value);
  const [saved, setSaved] = useState(SaveResult.idle);

  const view = (
    <>
      <span
        className={`has-tooltip-arrow ${styles.changeablefield}`}
        data-tooltip="click to change"
        onClick={() => setIsEditing(true)}
      >
        {value}
      </span>{" "}
      {(() => {
        switch (saved) {
          case SaveResult.success:
            return (
              <i
                style={{ color: "green" }}
                className="fas fa-light fa-circle-check"
              ></i>
            );
          case SaveResult.fail:
            return (
              <i
                style={{ color: "red" }}
                className="fas fa-light fa-circle-xmark"
              ></i>
            );
        }
      })()}
    </>
  );

  const edit = (
    <input
      onKeyUp={({ key }) => {
        switch (key) {
          case "Escape":
            setValue(props.value); // reset value
            break;
          case "Enter":
            if (props.value !== value) {
              // fire update in Bitrix24
              changeField(props.entity, props.id, props.field, value)
                .then(() => {
                  // change position in local data
                  dispatch(
                    changeFieldInStore({
                      id: props.id,
                      value,
                      entity: props.entity,
                    })
                  );
                  value || setValue("--");
                  setSaved(SaveResult.success);
                })
                .catch(() => setSaved(SaveResult.fail));
              setTimeout(() => setSaved(SaveResult.idle), 2000);
            }
        }
        // remove editing input
        (key === "Escape" || key === "Enter") && setIsEditing(false);
      }}
      autoFocus
      onChange={({ target }) => setValue(target.value)}
      className="input is-small"
      type="text"
      value={value}
    />
  );

  return isEditing ? edit : view;
}
