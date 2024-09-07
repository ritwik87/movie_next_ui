import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const baseQueryImageUpload = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,

    prepareHeaders: (headers) => {
      //   headers.set("Accept", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${window?.localStorage.getItem("access-token")}`
      );
      return headers;
    },
  });
  return baseQuery(args, api, extraOptions);
};
export default baseQueryImageUpload;
