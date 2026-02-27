import { baseAPI } from "../../../baseAPI/baseApi";
// import type { Patient } from "./types/adminPatient.type";

const adminPatientApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getSummary: build.query<any, void>({
      query: () => ({
        url: "/patient/summery/",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    getAdminSummary: build.query<any, void>({
      query: () => ({
        url: "/user/summery/",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    getAllPatient: build.query<any, { limit?: number; offset?: number } | void>({
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
      // bulkAddPatient: build.mutation<any, any>({
      //   query: (data) => ({
      //     url: "/patient/add/",
      //     method: "POST",
      //     body: data,
      //   }),
      //   invalidatesTags: ["Patient"],
      // }),
      uploadPatientFile: build.mutation<any, FormData>({
        query: (formData) => ({
          url: "/patient/add/upload-file-save",
          method: "POST",
          body: formData,
        }),
        invalidatesTags: ["Patient", "Admin"],
      }),
  }),
});

export const { 
  useGetAdminSummaryQuery,
    useGetSummaryQuery, 
    useAssignAgentMutation,
    useGetAllPatientQuery,
    useUploadPatientFileMutation
} = adminPatientApi;
