import { useState, type FormEvent } from "react";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "../store/api/categoriesApi";

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return "Something went wrong. Please try again.";
};

const Categories = () => {
  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    const categoryName = name.trim();
    if (!categoryName) {
      setError("Enter a category name.");
      return;
    }

    try {
      const response = await addCategory({ name: categoryName }).unwrap();
      setName("");
      setMessage(response.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  const handleDelete = async (id: string) => {
    setMessage("");
    setError("");
    setDeletingId(id);

    try {
      await deleteCategory(id).unwrap();
      setMessage("Category deleted.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-[90vh] bg-gray-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="mt-2 text-gray-600">
            Create categories to organize your transactions.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row"
        >
          <label className="sr-only" htmlFor="category-name">
            Category name
          </label>
          <input
            id="category-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Groceries"
            maxLength={60}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
          />
          <button
            type="submit"
            disabled={isAdding}
            className="rounded-lg bg-cyan-700 px-5 py-3 font-medium text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAdding ? "Adding..." : "Add category"}
          </button>
        </form>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p
            role="status"
            className="mb-4 rounded-lg bg-green-50 p-3 text-green-700"
          >
            {message}
          </p>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Your categories
          </h2>
          {isLoading ? (
            <p className="text-gray-600">Loading categories...</p>
          ) : isError ? (
            <p role="alert" className="text-red-700">
              Could not load categories. Check the backend connection and try
              again.
            </p>
          ) : categories.length === 0 ? (
            <p className="text-gray-600">
              No categories yet. Add one above to get started.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {categories.map((category) => (
                <li
                  key={category._id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <span className="font-medium text-gray-800">
                    {category.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(category._id)}
                    disabled={deletingId === category._id}
                    className="rounded-md px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === category._id ? "Removing..." : "Remove"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default Categories;
