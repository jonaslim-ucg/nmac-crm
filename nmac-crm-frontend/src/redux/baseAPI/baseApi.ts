// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { type RootState } from "../store";
// import { logout, setUser } from "../services/auth/auth.slice";
// import type {
//   BaseQueryFn,
//   FetchArgs,
//   FetchBaseQueryError,
// } from "@reduxjs/toolkit/query";


// const baseQueryAPI = fetchBaseQuery({
//   baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
// //   credentials: "include",
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth?.access_token;
//     // console.log(token)
//     if (token) {
//       headers.set("Authorization", `bearer ${token}`);
//     //   headers.set("Content-Type", "application/json");
//     //   headers.set("Accept", "application/json")
//     }
//     return headers;
//   },
// });

// export const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQueryAPI(args, api, extraOptions);
//   console.log(result)

//   if (result.error?.status === 401) {
//   const refreshToken = (api.getState() as RootState).auth?.refresh_token;
//   console.log(refreshToken)
//   if (!refreshToken) {
//     api.dispatch(logout());
//     return result;
//   }

//   const refreshResult = await baseQueryAPI(
//     {
//       url: "/auth/verify-token/",
//       method: "GET",
//       headers: {
//         Authorization: `bearer ${refreshToken}`,
//       },
//     },
//     api,
//     extraOptions
//   );
//   console.log(refreshResult)

//   if (refreshResult.data) {
//     const data = refreshResult.data as {
//       role: "ADMIN" | "MANAGER" | "AGENT";
//       new_tokens: {
//         access_token: string;
//         refresh_token: string;
//       };
//     };
//     console.log(data);

//     api.dispatch(
//       setUser({
//         access_token: data.new_tokens.access_token,
//         refresh_token: data.new_tokens.refresh_token,
//         role: data.role,
//       })
//     );

//     // retry original request
//     result = await baseQueryAPI(args, api, extraOptions);
//     console.log(result)

//   } else {
//     api.dispatch(logout());
//   }
// }


//   return result;
// };


//  export const baseAPI = createApi({
//    reducerPath: "baseAPI",
//    baseQuery: baseQueryWithReauth,
//    tagTypes: ["Auth", "Admin", "Manager", "Agent"],
//    endpoints: () => ({}),
//  });

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Admin", "Manager", "Agent", "Patient","Calls","Appointments","Settings"],
  endpoints: () => ({}),
});

 