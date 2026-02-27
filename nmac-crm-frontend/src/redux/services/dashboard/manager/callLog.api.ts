import { baseAPI } from "../../../baseAPI/baseApi";
import type { CreateCallPayload } from "./types/call";

const callLogApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    
    getAllCalls: build.query<any, { limit?: number; offset?: number } | void>({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: `/recall/calls/get-list?offset=${offset}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ["Manager"],
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
      createCall: build.mutation<any, CreateCallPayload>({
        query: (body) => ({
          url: '/recall/calls/create',
          method: 'POST',
        body: new URLSearchParams({
        patient_id: String(body.patient_id),              // string, e.g., 'PI118BF3'
        appointment_id: body.appointment_id != null ? String(body.appointment_id) : '0', // '0' if null
        call_duration: body.call_duration || '00:00:00',

        outcome: body.outcome || '',
        // call_duration: body.call_duration || '',
        contact_method: ['PHONE', 'WHATSAPP', 'EMAIL'].includes(body.contact_method ?? '') ? body.contact_method! : 'PHONE',
        patient_response: String(body.patient_response ?? false),
        interest_level: ['VERY_INTERESTED','INTERESTED','NEUTRAL','NOT_INTERESTED'].includes(body.interest_level ?? '') ? body.interest_level! : 'INTERESTED',
        concern: body.concern || '',
        note: body.note || '',
      }),


          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      invalidatesTags: ['Calls'],
    }),

  }),

});

export const { 
    useGetAllCallsQuery, 
    // useGetAllPatientQuery,
    useAssignAgentMutation,
    useCreateCallMutation
} = callLogApi;
