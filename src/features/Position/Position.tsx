import { changePosition as changePositionInB24 } from "app/endpoint";
import { useState } from "react";
import { Contact } from "types";
import styles from "./Position.module.css";
import { changeContactPosition as changePositionInStore } from "app/companySlice";
import { useAppDispatch } from "app/hooks";

interface PositionProps {
  positon: string;
  id: Contact["ID"];
}

enum SaveResult {
  success,
  fail,
  idle,
}

export default function Position(props: PositionProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState(props.positon);
  const [saved, setSaved] = useState(SaveResult.idle);

  const view = (
    <>
      <span
        className={`has-tooltip-arrow ${styles.position}`}
        data-tooltip="click to change"
        onClick={() => setIsEditing(true)}
      >
        {position}
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
            setPosition(props.positon); // reset position
            break;
          case "Enter":
            if (props.positon !== position) {
              // fire update in Bitrix24
              changePositionInB24(props.id, position)
                .then(() => {
                  // change position in local data
                  dispatch(
                    changePositionInStore({
                      id: props.id,
                      position,
                    })
                  );
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
      onChange={({ target }) => setPosition(target.value)}
      className="input is-small"
      type="text"
      value={position}
    />
  );

  return isEditing ? edit : view;
}
