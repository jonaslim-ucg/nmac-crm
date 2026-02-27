import { baseAPI } from "../../baseAPI/baseApi";

export interface NotificationAlert {
  user_id: string;
  email_notifications: boolean;
  whatsapp_notifications: boolean;
  call_reminder_notifications: boolean;
  reminder_frequency: string;
  daily_summery_alert: boolean;
  performance_alert: boolean;
  work_hour_start: string | null;
  work_hour_end: string | null;
}

export interface ExportRequest {
  export_type: 'agent_performance' | 'call_analytics';
  period: 'daily' | 'weekly' | 'yearly';
  agent_id?: string | null;
}

export interface AgentPerformanceResult {
  date: string;
  agent_id: string;
  agent_name: string;
  appointments: number;
  appointment_rate: number;
  conversation_rate: number;
  message_sent: number;
}

export interface ExportResponse {
  count: number;
  period: string;
  results: AgentPerformanceResult[];
}

const settingsApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllNotificationsAlert: build.query<NotificationAlert, void>({
      query: () => ({
        url: "/site/user-settings/",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }), 
    postNotificationAlert: build.mutation<any, Partial<NotificationAlert>>({
      query: (body) => ({
        url: "/site/user-settings/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getExportData: build.query<ExportResponse, ExportRequest>({
      query: (params) => ({
        url: "/site/export/export",
        method: "GET",
        params:{
          export_type: params.export_type,
          period: params.period,
          agent_id: params.agent_id,
        }
      }),
      providesTags: ["Settings"],
    }),
    getPrivacyData: build.query<any, void>({
      query: () => ({
        url: "/site/privacy/",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    postPrivacyData: build.mutation<any, any>({
      query: (body) => ({
        url: "/site/privacy/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    getTermsData: build.query<any, void>({
      query: () => ({
        url: "/site/terms/",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    postTermsData: build.mutation<any, any>({
      query: (body) => ({
        url: "/site/terms/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const { 
    useGetAllNotificationsAlertQuery,
    usePostNotificationAlertMutation,
    useLazyGetExportDataQuery,
    useGetPrivacyDataQuery,
    usePostPrivacyDataMutation,
    useGetTermsDataQuery,
    usePostTermsDataMutation
} = settingsApi;
