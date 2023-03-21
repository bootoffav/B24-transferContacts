import { Provider } from "react-redux";
import { store } from "../app/store";

export default (uiEl: JSX.Element) => <Provider store={store}>{uiEl}</Provider>;
