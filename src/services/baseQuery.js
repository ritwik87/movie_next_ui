import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseQueryMovies = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${window?.localStorage.getItem("access-token")}`
      );
      return headers;
    },
  });
  return baseQuery(args, api, extraOptions);
};
export default baseQueryMovies;
