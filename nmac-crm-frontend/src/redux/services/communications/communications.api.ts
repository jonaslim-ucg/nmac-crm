import { baseAPI } from "../../baseAPI/baseApi";

const communicationsApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    sendEmail: build.mutation<any, {
      subject: string;
      to: string;
      message: string;
      html_message?: string;
      from_email?: string;
      from_name?: string;
      cc?: string[];
      bcc?: string[];
      reply_to?: string[];
    }>({
      query: (body) => ({
        url: "/communications/send-email",
        method: "POST",
        body,
      }),
    }),
    sendWhatsAppOrEmail: build.mutation<any, {
      patient_id: string;
      platform: 'whatsapp' | 'email';
      subject?: string;
      message: string;
    }>({
      query: ({ patient_id, platform, subject, message }) => ({
        url: "/manager/email&whatsapp-message",
        method: "POST",
        params: {
          patient_id,
          platform,
          subject,
          message,
        },
      }),
    }),
  }),
});

export const { useSendEmailMutation, useSendWhatsAppOrEmailMutation } = communicationsApi;
