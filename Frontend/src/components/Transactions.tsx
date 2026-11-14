import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";
import { useGetCategoriesQuery } from "../store/api/categoriesApi";
import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useGetSummaryQuery,
  useGetTransactionsQuery,
} from "../store/api/transactionsApi";

const formatCurrency = (amount: number) =>
  `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
};

const Transactions = () => {
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useGetTransactionsQuery();
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetCategoriesQuery();
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetSummaryQuery();
  const [addTransaction, { isLoading: isAdding }] = useAddTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(getToday);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || transaction.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleAddTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!title.trim() || !category || !date) {
      setError("Enter a description, category, and date.");
      return;
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }

    try {
      await addTransaction({
        title: title.trim(),
        amount: numericAmount,
        type,
        category,
        date,
      }).unwrap();
      setTitle("");
      setAmount("");
      setMessage("Transaction added.");
    } catch {
      setError("Could not add the transaction. Please try again.");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setMessage("");
    setError("");

    try {
      await deleteTransaction(id).unwrap();
      setMessage("Transaction deleted.");
    } catch {
      setError("Could not delete the transaction. Please try again.");
    }
  };

  if (transactionsLoading || categoriesLoading || summaryLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 text-gray-600">
        Loading transactions...
      </main>
    );
  }

  if (transactionsError || categoriesError || summaryError || !summary) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-10 md:px-8">
        <p role="alert" className="mx-auto max-w-3xl text-red-700">
          Could not load transactions. Check the backend connection and try
          again.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[90vh] bg-gray-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-2 text-gray-600">
            Add income and expenses, then search or filter your history.
          </p>
        </header>

        <section
          aria-label="Financial totals"
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          {[
            { label: "Total income", amount: summary.totalIncome, color: "text-green-700" },
            { label: "Total expenses", amount: summary.totalExpenses, color: "text-red-700" },
            { label: "Balance", amount: summary.netAmount, color: "text-gray-900" },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-600">{item.label}</p>
              <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                {formatCurrency(item.amount)}
              </p>
            </article>
          ))}
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Add a transaction
          </h2>
          {categories.length === 0 ? (
            <p className="text-gray-600">
              Create a category before adding a transaction.{" "}
              <Link
                to="/categories"
                className="font-medium text-cyan-800 hover:underline"
              >
                Manage categories
              </Link>
            </p>
          ) : (
            <form
              onSubmit={handleAddTransaction}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
            >
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Description
                <input
                  required
                  maxLength={100}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Grocery shopping"
                  className="rounded-lg border border-gray-300 px-3 py-2 font-normal outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Amount
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0.00"
                  className="rounded-lg border border-gray-300 px-3 py-2 font-normal outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Type
                <select
                  value={type}
                  onChange={(event) =>
                    setType(
                      event.target.value === "income" ? "income" : "expense",
                    )
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 font-normal outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Category
                <select
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 font-normal outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  {categories.map((item) => (
                    <option key={item._id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Date
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="rounded-lg border border-gray-300 px-3 py-2 font-normal outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
                />
              </label>
              <div className="sm:col-span-2 lg:col-span-5">
                <button
                  type="submit"
                  disabled={isAdding}
                  className="rounded-lg bg-cyan-700 px-5 py-3 font-medium text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isAdding ? "Adding..." : "Add transaction"}
                </button>
              </div>
            </form>
          )}
        </section>

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

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Transaction history
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="sr-only" htmlFor="transaction-search">
                Search transactions
              </label>
              <input
                id="transaction-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search descriptions"
                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
              />
              <label className="sr-only" htmlFor="type-filter">
                Filter by type
              </label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <label className="sr-only" htmlFor="category-filter">
                Filter by category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="all">All categories</option>
                {categories.map((item) => (
                  <option key={item._id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <p className="p-8 text-center text-gray-600">
              No transactions match your search.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction, index) => (
                <li
                  key={transaction._id ?? `${transaction.title}-${index}`}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {transaction.type === "income" ? (
                      <FaArrowUp
                        aria-label="Income"
                        className="shrink-0 text-green-700"
                      />
                    ) : (
                      <FaArrowDown
                        aria-label="Expense"
                        className="shrink-0 text-red-700"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">
                        {transaction.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.category} · {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <p
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <button
                      type="button"
                      aria-label={`Delete ${transaction.title}`}
                      onClick={() => {
                        if (
                          transaction._id &&
                          window.confirm("Delete this transaction?")
                        ) {
                          void handleDeleteTransaction(transaction._id);
                        }
                      }}
                      className="rounded-md p-2 text-red-700 hover:bg-red-50"
                    >
                      <FaTrash aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default Transactions;
