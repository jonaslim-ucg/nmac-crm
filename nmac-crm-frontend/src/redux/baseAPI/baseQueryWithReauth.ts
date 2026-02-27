import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { baseQueryAPI } from "./baseQuery";
import { logout, setUser } from "../services/auth/auth.slice";
import type { RootState } from "../store";


export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {

  let result = await baseQueryAPI(args, api, extraOptions);

  if (result?.error?.status === 401) {

    const refreshToken = (api.getState() as RootState).auth.refresh_token;
    // const role = (api.getState() as RootState).auth.role;
    console.log("Refresh token:", refreshToken);

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }
    const accessToken = (api.getState() as RootState).auth.access_token;

    const refreshResult = await baseQueryAPI(
      {
        url: "/auth/verify-token/",
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "refresh-token": refreshToken,
        },
      },
      api,
      extraOptions
    );

    // console.log("Refresh result:", refreshResult);

    if (refreshResult?.data) {

      const { access_token, refresh_token } =
        (refreshResult.data as any).new_tokens;

      // ✅ SAVE NEW TOKENS
      api.dispatch(
        setUser({
          access_token: access_token,
          refresh_token: refresh_token,
          role: (refreshResult.data as any).role,
        })
      );

      // ✅ RETRY ORIGINAL REQUEST
      result = await baseQueryAPI(args, api, extraOptions);

    } else {

      // ❌ Refresh failed
      api.dispatch(logout());
    }
  }

  return result;
};
