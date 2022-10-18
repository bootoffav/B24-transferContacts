import { changePosition } from "app/endpoint";
import { useState, useEffect } from "react";
import { Contact } from "types";
import styles from "./Position.module.css";

interface PositionProps {
  value: string;
  id: Contact["ID"];
}

enum SaveResult {
  success,
  fail,
  idle,
}

export default function Position({ value, id }: PositionProps) {
  const [editMode, setEditMode] = useState(false);
  const [position, setPosition] = useState(value);
  const [saved, setSaved] = useState(SaveResult.idle);

  const view = (
    <>
      <span
        className={`has-tooltip-arrow ${styles.position}`}
        data-tooltip="click to change"
        onClick={() => setEditMode(true)}
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

  const onChange = ({ target }: React.SyntheticEvent) => {
    setPosition((target as HTMLInputElement).value);
  };

  const edit = (
    <input
      onKeyUp={(e) => {
        if (e.key === "Escape") {
          setPosition(value);
          setEditMode(false);
        }
        e.key === "Enter" && setEditMode(false);
      }}
      autoFocus
      onChange={onChange}
      className="input is-small"
      type="text"
      value={position}
    />
  );

  useEffect(() => {
    if (!editMode && value !== position) {
      changePosition(id, position)
        .then(() => setSaved(SaveResult.success))
        .catch(() => setSaved(SaveResult.fail));
      setTimeout(() => setSaved(SaveResult.idle), 2000);
    }
  }, [editMode, value, position, id]);

  return editMode ? edit : view;
}
