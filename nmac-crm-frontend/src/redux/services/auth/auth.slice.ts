import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

type SetUserPayload = {
  access_token: string;
  refresh_token: string;
  role: "AGENT" | "MANAGER" | "ADMIN" | null;
};

export type TAuthState = {
  access_token: string | null;
  refresh_token: string | null;
  role: "AGENT" | "MANAGER" | "ADMIN" | null;
};


const initialState: TAuthState = {
  access_token: null,
  refresh_token: null,
  role: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const {
        access_token,
        refresh_token,
        role,
      } = action.payload;

      state.access_token = access_token;
      state.refresh_token = refresh_token;
      state.role = role;
    },

    logout: (state) => {
      state.access_token = null;
      state.refresh_token = null;
      state.role = null;
    },
  },
});


export const { setUser, logout } = authSlice.actions;

/* Selectors */
export const selectAccessToken = (state: RootState) =>
  state.auth.access_token;

export const selectRefreshToken = (state: RootState) =>
  state.auth.refresh_token;

export const selectRole = (state: RootState) => state.auth.role;

export default authSlice.reducer;


