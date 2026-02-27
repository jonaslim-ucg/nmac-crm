import { baseAPI } from "../../../baseAPI/baseApi";
import type { ApiUser} from "./types/adminUser.type";

const adminUserApi = baseAPI.injectEndpoints({
    endpoints: (build) => ({  
        getUser: build.query<any, void>({
            query: () => ({ 
                url: "/user/users",
                method: "GET",
            }),
            providesTags: ["Admin"],
        }),
        createUser: build.mutation<ApiUser, FormData>({
            query: (formData) => ({
                url: "/user/users/create/create",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Admin"],
        }),
        updateUserProfile: build.mutation<ApiUser, { user_id: string; body: FormData }>({
            query: ({ user_id, body }) => ({
                url: `/user/users/update-profile?user_id=${user_id}`,
                method: 'PATCH',
                body, // Pass FormData directly
            }),
            invalidatesTags: ["Admin"],
        }),
        deleteUserProfile: build.mutation<
            { message: string },   
            string            
            >({
            query: (user_id) => ({
                url: `/user/users/delete`,
                method: 'DELETE',
                params: { user_id },
            }),
            invalidatesTags: ['Admin'],
        }),
        getAgentPerformance: build.query<any, string>({
            query: (agent_id) => ({
                url: `/user/performance/agent`,
                method: 'GET',
                params: {
                agent_id,
                },
            }),
        }),


    }),
});

export const { 
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserProfileMutation,
    useDeleteUserProfileMutation,
    useGetAgentPerformanceQuery
} = adminUserApi;