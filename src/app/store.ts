import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import company from "./companySlice";
import common from "./commonSlice";
import list from "features/List/listSlice";
import options from "features/Options/OptionsSlice";
import transferButton from "features/TransferButton/TransferButtonSlice";

export const store = configureStore({
  reducer: {
    company: company.reducer,
    common: common.reducer,
    list: list.reducer,
    transferButton: transferButton.reducer,
    options: options.reducer,
  },
  devTools: process.env.NODE_ENV === "development",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
