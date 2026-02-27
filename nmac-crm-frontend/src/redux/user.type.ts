export type LoginPayload = {
  email: string;
  password: string;
  otp_value?: string; 
};

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  password: string;
  token: string;
};