import { useAppSelector, useAppDispatch } from "app/hooks";
import { setLinkedInOnly } from "app/commonSlice";

export default function LinkedInOnly() {
  const linkedInOnly = useAppSelector(({ common }) => common.linkedInOnly);
  const dispatch = useAppDispatch();

  return (
    <label className="checkbox">
      <input
        type="checkbox"
        checked={linkedInOnly}
        onChange={({ currentTarget }) => {
          dispatch(setLinkedInOnly(currentTarget.checked));
        }}
      />
      &nbsp;LinkedIn only
    </label>
  );
}
