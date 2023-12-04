import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseURL = "http://video-streaming-api.mastercode.jp:8000/";
// const baseURL = "http://127.0.0.1:8000/";

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: ["Videos"],
  endpoints: (builder) => ({
    getVideos: builder.query({
      query: () => `/videos/`,
      providesTags: ["Videos"],
    }),
    updateVideos: builder.mutation({
      query: ({ id, data }) => ({
        url: `videos/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Videos"],
    }),
    deleteVideos: builder.mutation({
      query: (ids) => ({
        url: `videos/delete_videos/`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: { ids },
      }),
    }),
  }),
});

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => `/categories/`,
    }),
  }),
});

export const gradeApi = createApi({
  reducerPath: "gradeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: ["Grades"],
  endpoints: (builder) => ({
    getGrades: builder.query({
      query: (id) => `/grades/?category_id=${id}`,
    }),
  }),
});

export const unitApi = createApi({
  reducerPath: "unitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: ["Units"],
  endpoints: (builder) => ({
    getUnits: builder.query({
      query: (id) => `/units/?grade_id=${id}`,
    }),
    updateUnits: builder.mutation({
      query: (ids) => ({
        url: `/units/update_units/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { ids },
      }),
    }),
  }),
});

export const wordApi = createApi({
  reducerPath: "wordApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: ["Words"],
  endpoints: (builder) => ({
    getWords: builder.query({
      query: (id) => `/words/?video_id=${id}`
    }),
  }),
});

export const stampApi = createApi({
  reducerPath: 'stampApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL
  }),
  tagTypes: ["Stamps"],
  endpoints: (builder) => ({
    getStamps: builder.query({
      query: (id) => `/stamps/?video_id=${id}`
    }),
    createStamp: builder.mutation({
      query: (formData) => ({
        url: `/stamps/`,
        method: "POST",
        body: formData,
      }),
    })
  })
})

export const {
  useGetVideosQuery,
  useUpdateVideosMutation,
  useDeleteVideosMutation,
} = videoApi;
export const { useGetCategoriesQuery } = categoryApi;
export const { useGetGradesQuery } = gradeApi;
export const { useGetUnitsQuery, useUpdateUnitsMutation } = unitApi;
export const { useGetWordsQuery } = wordApi;
export const { useGetStampsQuery, useCreateStampMutation } = stampApi;
