import { baseAPI } from "../../baseAPI/baseApi";
// import type { ForgotPasswordPayload, LoginPayload, ResetPasswordPayload } from "../../user.type";

 const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<any, any>({
      query: ({ email, password, otp_value }) => {
        let url = "/auth/login/";
        if (otp_value) url += `?otp_value=${otp_value}`; 

        return {
          url,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            email,
            password,
          }).toString(),
        };
      },
      invalidatesTags: ["Auth"],
    }),

    sendMail: build.mutation<any, any>({
      query: ({ email }) => ({
        url: "/auth/forgot_otp/",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            email,
          }).toString(),
      }),
      invalidatesTags: ["Auth"],
    }),

    verifyOtp: build.mutation<any, { email: string; otp_value: string }>({
      query: ({ email, otp_value }) => ({
        url: "/auth/verify_otp",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email,
          otp_value,
        }).toString(),
      }),
    }),

    forgotPassword: build.mutation<
      any,
      { email: string; password: string; session_key: string }
    >({
      query: (body) => ({
        url: "/auth/forgot_password/",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: body.email,
          password: body.password,
          session_key: body.session_key,
        }).toString(),
      }),
    }),

    resetPassword: build.mutation<
      any,
      { old_password: string; password: string; refresh_token: string}
    >({
      query: ({ old_password, password, refresh_token }) => ({
        url: "/auth/reset_password/",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        params: { refresh_token },

        body: new URLSearchParams({
          old_password,
          password,
        }).toString(),
      }),
    }),

    verifyToken: build.mutation<
      any,
      { refresh_token: string }
    >({
      query: ({ refresh_token }) => ({
        url: "/auth/verify-token/",
        method: "GET",
        headers: {
          // Authorization: `Bearer ${access_token}`,
          "refresh-token": refresh_token,
        },
      }),
    }),

    getUserProfile: build.query<any, void>({
      query: () => ({
        url: "/user/users/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    updateProfile: build.mutation<any, any>({
      query: (body) => ({
        url: "/user/users/me/update-profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    
  }),
});

export const {
  useLoginMutation,
  useSendMailMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useVerifyTokenMutation


} = userAPI;
