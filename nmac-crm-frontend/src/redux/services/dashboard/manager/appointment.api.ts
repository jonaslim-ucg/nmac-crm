import { baseAPI } from "../../../baseAPI/baseApi";
// import type { Patient } from "./types/adminPatient.type";
interface AppointmentPayload {
  appointment_date: string;
  appointment_time: string;
  patient_id: number;
  notes?: string;
}

const appointmentApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createAppointment: build.mutation<any, AppointmentPayload>({
      query: (formData) => ({
        url: "/appointment/appointments/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Appointments"],
    }),
    
    getAppointments: build.query<any, void>({
      query: () => ({
        url: "/appointment/appointments/get-list/",
        method: "GET",
      }),
      providesTags: ["Appointments"],
    }),  
  }),
});

export const { useCreateAppointmentMutation,useGetAppointmentsQuery } = appointmentApi;
