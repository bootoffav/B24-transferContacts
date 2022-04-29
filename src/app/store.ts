import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import companyReducer from "./companySlice";
import commonReducer from "./commonSlice";
import countrySelectorReducer from "../features/countrySelector/countrySelectorSlice";

// @ts-ignore
window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

export const store = configureStore({
  reducer: {
    countrySelector: countrySelectorReducer,
    company: companyReducer,
    common: commonReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
