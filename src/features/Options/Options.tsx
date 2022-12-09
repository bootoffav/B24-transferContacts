import { Stage } from "app/commonSlice";
import { useAppSelector, useAppDispatch } from "app/hooks";
import { setCheckboxOption, OptionsState } from "./OptionsSlice";

interface IOptions {
  type: keyof OptionsState & string;
}

export default function Options({ type }: IOptions) {
  const labels = new Map<keyof OptionsState & string, string>([
    ["includeDeals", "Include deals"],
    ["includeLeads", "Include leads"],
  ]);

  const dispatch = useAppDispatch();
  const checked = useAppSelector(({ options }) => options[type]);
  const disabled = useAppSelector(({ common }) => {
    return (
      common.linkedInOnly ||
      ![
        Stage.initial,
        Stage.scanFinished,
        Stage.stuck,
        Stage.transferred,
      ].includes(common.stage)
    );
  });

  return (
    <label
      className="checkbox"
      // @ts-expect-error
      disabled={disabled}
    >
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={({ currentTarget }) =>
          dispatch(
            setCheckboxOption({ what: type, newValue: currentTarget.checked })
          )
        }
      />{" "}
      {`${labels.get(type)}`}
    </label>
  );
}
