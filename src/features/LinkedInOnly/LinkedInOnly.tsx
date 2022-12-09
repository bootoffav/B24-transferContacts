import { useAppSelector, useAppDispatch } from "app/hooks";
import { Stage } from "app/commonSlice";
import { setLinkedInOnly } from "app/commonSlice";

export default function LinkedInOnly() {
  const linkedInOnly = useAppSelector(({ common }) => common.linkedInOnly);
  const dispatch = useAppDispatch();
  const disabled = useAppSelector(
    ({ common: { stage } }) =>
      ![
        Stage.initial,
        Stage.scanFinished,
        Stage.stuck,
        Stage.transferred,
      ].includes(stage)
  );

  return (
    <label
      className="checkbox"
      // @ts-expect-error
      disabled={disabled}
    >
      <input
        type="checkbox"
        disabled={disabled}
        checked={linkedInOnly}
        onChange={({ currentTarget }) => {
          dispatch(setLinkedInOnly(currentTarget.checked));
        }}
      />
      &nbsp;LinkedIn only
    </label>
  );
}
