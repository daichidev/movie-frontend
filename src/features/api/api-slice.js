import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const videoApi = createApi({
  reducerPath: "videoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/",
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
    baseUrl: "http://127.0.0.1:8000/",
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
    baseUrl: "http://127.0.0.1:8000/",
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
    baseUrl: "http://127.0.0.1:8000/",
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

export const {
  useGetVideosQuery,
  useUpdateVideosMutation,
  useDeleteVideosMutation,
} = videoApi;
export const { useGetCategoriesQuery } = categoryApi;
export const { useGetGradesQuery } = gradeApi;
export const { useGetUnitsQuery, useUpdateUnitsMutation } = unitApi;
