import { useAppDispatch, useAppSelector } from "app/hooks";
import { setStage, Stage, setTransferredAmount } from "app/commonSlice";
import { transferEntity } from "app/endpoint";
import { differentResponsiblesAmount } from "features/helpers";
import { setTransferType, allTransferTypes } from "./TransferButtonSlice";

export default function TransferButton() {
  const dispatch = useAppDispatch();
  const { differentResponsibles } = useAppSelector(({ company }) => company);
  const { transferType } = useAppSelector(
    ({ transferButton }) => transferButton
  );

  const handler = async () => {
    dispatch(setStage(Stage.transferring));
    // eslint-disable-next-line
    for await (let _ of transferEntity(differentResponsibles, transferType)) {
      dispatch(setTransferredAmount(1));
    }
    dispatch(setStage(Stage.transferred));
    dispatch(setTransferredAmount(0));
  };

  const handleSelectChange = ({
    currentTarget: { value },
  }: React.SyntheticEvent<HTMLSelectElement>) => {
    dispatch(setTransferType(value as typeof allTransferTypes[number]));
  };

  return differentResponsiblesAmount(differentResponsibles) ? (
    <div className="is-flex is-justify-content-center field has-addons">
      <div className="control">
        <div className="select is-small">
          <select
            name="transferType"
            defaultValue={transferType}
            onChange={handleSelectChange}
          >
            {allTransferTypes.map((type) => (
              <option key={type} value={type} selected={type === transferType}>
                process {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="control">
        <button
          type="submit"
          className="button is-success is-small is-light"
          onClick={handler}
        >
          FIX THEM!
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
