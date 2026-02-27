import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const baseQueryAPI = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  
//  prepareHeaders: (headers, { getState }) => {
//   const token = (getState() as RootState).auth.access_token;
//   if (token) headers.set("Authorization", `Bearer ${token}`);
//   return headers;
// }
prepareHeaders: (headers, { getState, endpoint }) => {

  const token = (getState() as RootState).auth.access_token;

  // ❌ Skip auth header for refresh endpoint
  if (endpoint !== "refreshToken" && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
},


});
