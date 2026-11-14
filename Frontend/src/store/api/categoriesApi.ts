import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Category {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NewCategory {
  name: string;
}

interface AddCategoryResponse {
  category: Category;
  message: string;
}

export const categoriesApi = createApi({
  reducerPath: "categoriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  }),
  tagTypes: ["Category", "Transaction"],
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
    addCategory: builder.mutation<AddCategoryResponse, NewCategory>({
      query: (category) => ({
        url: "/categories",
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Transaction"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
