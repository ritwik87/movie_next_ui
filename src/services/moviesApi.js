import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryMovies from "./baseQuery";

export const moviesApi = createApi({
  reducerPath: "moviesApi",
  baseQuery: baseQueryMovies,
  tagTypes: ["Movies"],
  endpoints: (builder) => ({
    getMovies: builder.query({
      query: () => ({
        url: "movies",
        // params: {
        //   fields: params.fields,
        //   pageNo: params.pageNo,
        //   pagesize: params.pageSize,
        //   order: params.sortOrder,
        // },
      }),
      providesTags: ["Movie"],
    }),
    getMovieById: builder.query({
      query: ({ id }) => ({
        url: `movies/${id}`,
      }),
      providesTags: ["Movie"],
    }),
    postMovies: builder.mutation({
      query: ({ payload }) => ({
        url: `movies`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Movie"],
    }),
    putMovies: builder.mutation({
      query: ({ id, payload }) => ({
        url: `movies/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Movie"],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  usePostMoviesMutation,
  usePutMoviesMutation,
  useGetMovieByIdQuery,
} = moviesApi;
