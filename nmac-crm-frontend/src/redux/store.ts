// import { configureStore } from '@reduxjs/toolkit'
// import {
//   FLUSH,
//   PAUSE,
//   PERSIST,
//   persistReducer,
//   persistStore,
//   PURGE,
//   REGISTER,
//   REHYDRATE
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import { baseAPI } from "./baseAPI/baseApi";
// import authReducer from './services/auth/auth.slice';

//  const persistConfig = {
//     key: "nmac_crm_auth",
//     version: 1,
//     storage,
//     whitelist: ["auth"],
//   };

// const persistedReducer = persistReducer(persistConfig, authReducer);

// export const store = configureStore({
//   reducer: {
//     auth: persistedReducer,
//     [baseAPI.reducerPath]: baseAPI.reducer,
//     // [aiBaseApi.reducerPath]: aiBaseApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
//       },
//     })
//     // Core API middleware
//       .concat(baseAPI.middleware)

//     // AI API middleware (THIS WAS MISSING)
//     //   .concat(aiBaseApi.middleware),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./services/auth/auth.slice";
import { baseAPI } from "./baseAPI/baseApi";

// 1️⃣ Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  [baseAPI.reducerPath]: baseAPI.reducer,
});

// 2️⃣ Persist config
const persistConfig = {
  key: "nmac_crm_auth",
  storage,
  whitelist: ["auth"], // only persist auth slice
};

// 3️⃣ Wrap root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(baseAPI.middleware),
});

// 5️⃣ Persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

