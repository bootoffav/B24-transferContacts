import { Provider } from "react-redux";
import { store } from "../app/store";

const storeConnected = (uiEl: JSX.Element) => {
  return <Provider store={store}>{uiEl}</Provider>;
};

export default storeConnected;
