import { useAppDispatch, useAppSelector } from "app/hooks";
import { setStage, Stage, setTransferredAmount } from "app/commonSlice";
import { transferEntity } from "app/endpoint";
import { getAmountToTransfer } from "app/helpers";
import {
  setTransferEntityType,
  allTransferEntityTypes,
  setTransferType,
} from "./TransferButtonSlice";

export default function TransferButton() {
  const dispatch = useAppDispatch();
  const { differentResponsibles } = useAppSelector(({ company }) => company);
  const { transferEntityType } = useAppSelector(
    ({ transferButton }) => transferButton
  );

  const handler = async () => {
    dispatch(setStage(Stage.transferring));
    dispatch(setTransferType("responsible"));
    dispatch(setTransferredAmount(0));
    // eslint-disable-next-line
    for await (let _ of transferEntity(
      differentResponsibles,
      transferEntityType
    )) {
      dispatch(setTransferredAmount(1));
    }
    dispatch(setStage(Stage.transferred));
    dispatch(setTransferredAmount(0));
  };

  const handleSelectChange = ({
    currentTarget: { value },
  }: React.SyntheticEvent<HTMLSelectElement>) => {
    dispatch(
      setTransferEntityType(value as typeof allTransferEntityTypes[number])
    );
  };

  return getAmountToTransfer(differentResponsibles, "responsible") ? (
    <div className="is-flex is-justify-content-center field has-addons">
      <div className="control">
        <div className="select is-small">
          <select
            name="transferType"
            defaultValue={transferEntityType}
            onChange={handleSelectChange}
          >
            {allTransferEntityTypes.map((type) => (
              <option key={type} value={type}>
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
