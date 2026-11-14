import { configureStore } from "@reduxjs/toolkit";
import { transactionsApi } from "./api/transactionsApi";
import { categoriesApi } from "./api/categoriesApi";

export const store = configureStore({
  reducer: {
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(transactionsApi.middleware)
      .concat(categoriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
