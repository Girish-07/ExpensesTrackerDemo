import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-[90vh] bg-gray-50 px-4 py-16 md:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm md:px-12">
          <p className="mb-4 font-medium text-cyan-800">
            A simple personal finance tracker
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
            Know where your money goes.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Record income and expenses, organize them by category, and review
            your totals in one place.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/transactions")}
              className="rounded-lg bg-cyan-700 px-6 py-3 font-medium text-white hover:bg-cyan-800"
            >
              Add a transaction
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-800 hover:bg-gray-50"
            >
              View dashboard
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Record transactions
            </h2>
            <p className="mt-2 text-gray-600">
              Add income or expenses with an amount, date, and category.
            </p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Organize categories
            </h2>
            <p className="mt-2 text-gray-600">
              Create and manage categories that fit your spending.
            </p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Review your totals
            </h2>
            <p className="mt-2 text-gray-600">
              See your income, expenses, balance, and monthly trend.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
};

export default Home;
