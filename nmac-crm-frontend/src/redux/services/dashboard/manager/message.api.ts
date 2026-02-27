// messageApi.ts
import { baseAPI } from "../../../baseAPI/baseApi";

const messageApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllMessages: build.query<any, { limit?: number; offset?: number } | void>({
      query: ({ limit = 20, offset = 0 } = {}) => ({
        url: `/manager/message-history-list?offset=${offset}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ["Manager"],
    }),
    getAllMessageTemplates: build.query<any, void>({
      query: () => ({
        url: "/manager/message-templates",
        method: "GET",
      }),
      providesTags: ["Manager"],
    }),
    addMessageTemplate: build.mutation<any, {
      name: string;
      communication_type: 'whatsapp' | 'email' | 'both';
      category: string;
      status: 'active' | 'draft';
      subject?: string;
      content: string;
    }>({
      query: (body) => ({
        url: '/manager/message-template',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(body as Record<string, string>).toString(),
      }),
      invalidatesTags: ["Manager"],
    }),
    updateMessageTemplate: build.mutation<any, { template_id: number; message: string }>({
      query: ({ template_id, message }) => ({
        url: `/manager/message-template/${template_id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ message }).toString(),
      }),
      invalidatesTags: ["Manager"],
    }),
    deleteMessageTemplate: build.mutation<any, { template_id: number }>({
      query: ({ template_id }) => ({
        url: `/manager/message-template/${template_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Manager"],
    }),
    useTemplate: build.mutation<any, { temp_id: number; patient_id: string }>({
      query: ({ temp_id, patient_id }) => ({
        url: `/manager/use-template?temp_id=${temp_id}&patient_id=${patient_id}`,
        method: 'POST',
      }),
    }),
      
  }),
});

export const { 
  useGetAllMessagesQuery, 
  useGetAllMessageTemplatesQuery,
  useAddMessageTemplateMutation ,
  useUpdateMessageTemplateMutation,
  useDeleteMessageTemplateMutation,
  useUseTemplateMutation
} = messageApi;
