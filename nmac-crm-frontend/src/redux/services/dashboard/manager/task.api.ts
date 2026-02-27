import { baseAPI } from "../../../baseAPI/baseApi";
// import type { Patient } from "./types/adminPatient.type";

const taskApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<any, void>({
      query: () => ({
        url: "/agent/task/get-task-list",
        method: "GET",
      }),
      providesTags: ["Agent"],
    }),  
  }),
});

export const { useGetTasksQuery } = taskApi;
