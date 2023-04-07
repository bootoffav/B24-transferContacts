import { store } from "app/store";
import { setViewMode, ViewMode } from "features/List/listSlice";
import type { ListSliceState } from "features/List/listSlice";

const customLinkHandler = (
  customViewEntityType: ListSliceState["customViewEntityType"],
  customViewId: ListSliceState["customViewId"],
  customCountryAndUser?: ListSliceState["customCountryAndUser"]
) => {
  store.dispatch(
    setViewMode(
      ViewMode.custom,
      customViewEntityType,
      customViewId,
      customCountryAndUser
    )
  );
};

export { customLinkHandler };
