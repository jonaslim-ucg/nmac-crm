import { baseAPI } from "../../../baseAPI/baseApi";
// import type { Patient } from "./types/adminPatient.type";

const managerApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getPatientSummary: build.query<any, void>({
      query: () => ({
        url: "/patient/summery/",
        method: "GET",
      }),
      providesTags: ["Manager"],
    }),  
    getPatientVisitType: build.query<any, void>({
      query: () => ({
        url: "/patient/summery/visit-type-stats",
        method: "GET",
      }),
      providesTags: ["Manager"],
    }), 
    getNonBookingSummary: build.query<any, void>({
      query: () => ({
        url: "/recall/summery/calls",
        method: "GET",
      }),
      providesTags: ["Manager"],
    }),

    getCallsOutreachSummary: build.query<any, void>({
      query: () => ({
        url: "/recall/summery/contact-method-summary",
        method: "GET",
      }),
      providesTags: ["Manager"],
    }),

    getBookingSummary: build.query<any, void>({
      query: () => ({
        url: "/recall/summery/conversion-summary",
        method: "GET",
      }),
      providesTags: ["Manager"],
    }),

    getCallsSummary: build.query<any, { limit?: number; offset?: number } | void>({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: `/patient/get/?limit=${limit}&offset=${offset}`,
        method: 'GET',
      }),
      providesTags: ["Admin"],
    }),

    assignAgent: build.mutation<
        any,
        { patientId: string; agentId: string }
      >({
        query: ({ patientId, agentId }) => {
          const body = new URLSearchParams();
          body.append('patient_id', patientId);
          body.append('agent_id', agentId);

          return {
            url: '/patient/update/assign-agent',
            method: 'PATCH',
            body,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          };
        },
        invalidatesTags: ['Admin'],
      }),
    getPatient: build.query<any, { patientId: string }>({
      query: ({ patientId }) => ({
        url: `/patient/get/details?patient_id=${patientId}`,
        method: "GET",
      }),
      providesTags: ["Patient"],
    }),
    updatePatientStatus: build.mutation({
      query: ({ patient_id, status }) => ({
        url: '/patient/update/status',
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          patient_id,
          status,
        }).toString(),
      }),

      invalidatesTags: ['Patient']
    }),


    getTopAgents: build.query<any, void>({
      query: () => ({
        url: "/user/summery/top-agents",
        method: "GET",
      }),
      providesTags: ["Manager"],
    }),
    sendMessage: build.mutation<any, { patient_id: string; platform: string; subject?: string; message: string }>({
      query: ({ patient_id, platform, subject, message }) => ({
        url: `/manager/email&whatsapp-message?patient_id=${patient_id}&platform=${platform}&subject=${subject || platform}&message=${message}`,
        method: "POST",
      }),
      invalidatesTags: ["Manager"],
    }),
  }),
});

export const { 
    useGetPatientSummaryQuery,
    useGetPatientVisitTypeQuery,
    useGetNonBookingSummaryQuery, 
    useGetCallsOutreachSummaryQuery,
    useGetBookingSummaryQuery,
    useGetCallsSummaryQuery,
    useAssignAgentMutation,
    useGetPatientQuery,
    useUpdatePatientStatusMutation,
    useGetTopAgentsQuery,
    useSendMessageMutation
} = managerApi;
