import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import company from "./companySlice";
import common from "./commonSlice";
import list from "../features/List/ListSlice";

export const store = configureStore({
  reducer: {
    company: company.reducer,
    common: common.reducer,
    list: list.reducer,
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
