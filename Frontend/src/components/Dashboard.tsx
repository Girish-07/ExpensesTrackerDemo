import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FaArrowDown, FaArrowUp, FaPlus } from "react-icons/fa";
import {
  useGetSummaryQuery,
  useGetTransactionsQuery,
} from "../store/api/transactionsApi";

const formatCurrency = (amount: number) =>
  `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useGetTransactionsQuery();
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetSummaryQuery();

  const monthlyData = useMemo(() => {
    const totals: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      if (Number.isNaN(date.getTime())) return;

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}`;
      totals[monthKey] ??= { income: 0, expense: 0 };
      totals[monthKey][transaction.type] += transaction.amount;
    });

    return Object.entries(totals)
      .sort(([first], [second]) => first.localeCompare(second))
      .slice(-6)
      .map(([monthKey, amounts]) => {
        const [year, month] = monthKey.split("-").map(Number);
        return {
          month: new Date(year, month - 1).toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          ...amounts,
        };
      });
  }, [transactions]);

  if (transactionsLoading || summaryLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 text-gray-600">
        Loading your finances...
      </main>
    );
  }

  if (transactionsError || summaryError || !summary) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-10 md:px-8">
        <p role="alert" className="mx-auto max-w-3xl text-red-700">
          Could not load your finances. Check the backend connection and try
          again.
        </p>
      </main>
    );
  }

  const recentTransactions = transactions.slice(0, 5);
  const cards = [
    { label: "Total income", amount: summary.totalIncome, color: "text-green-700" },
    { label: "Total expenses", amount: summary.totalExpenses, color: "text-red-700" },
    { label: "Balance", amount: summary.netAmount, color: "text-gray-900" },
  ];

  return (
    <main className="min-h-[90vh] bg-gray-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              A summary of all your recorded transactions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="flex items-center justify-center gap-2 rounded-lg bg-cyan-700 px-5 py-3 font-medium text-white hover:bg-cyan-800"
          >
            <FaPlus aria-hidden="true" />
            Add transaction
          </button>
        </header>

        <section
          aria-label="Financial totals"
          className="mb-8 grid gap-4 sm:grid-cols-3"
        >
          {cards.map((card) => (
            <article
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-600">{card.label}</p>
              <p className={`mt-2 text-2xl font-bold ${card.color}`}>
                {formatCurrency(card.amount)}
              </p>
            </article>
          ))}
        </section>

        <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Income and expenses by month
          </h2>
          {monthlyData.length === 0 ? (
            <p className="py-12 text-center text-gray-600">
              Add transactions to see your monthly trend.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#15803d"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  name="Expenses"
                  stroke="#b91c1c"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent transactions
            </h2>
            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="font-medium text-cyan-800 hover:underline"
            >
              View all
            </button>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="p-5 text-gray-600">No transactions recorded yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentTransactions.map((transaction, index) => (
                <li
                  key={transaction._id ?? `${transaction.title}-${index}`}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex items-center gap-3">
                    {transaction.type === "income" ? (
                      <FaArrowUp
                        aria-label="Income"
                        className="text-green-700"
                      />
                    ) : (
                      <FaArrowDown
                        aria-label="Expense"
                        className="text-red-700"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transaction.category} · {transaction.date}
                      </p>
                    </div>
                  </div>
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
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
