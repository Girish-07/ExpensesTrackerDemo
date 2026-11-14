import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBars,
  FaChartLine,
  FaHome,
  FaRegCreditCard,
  FaTags,
  FaTimes,
} from "react-icons/fa";

const navItems = [
  { label: "Home", path: "/", icon: <FaHome aria-hidden="true" /> },
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <FaChartLine aria-hidden="true" />,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: <FaRegCreditCard aria-hidden="true" />,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: <FaTags aria-hidden="true" />,
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
      pathname === path
        ? "bg-white text-cyan-900"
        : "text-white hover:bg-cyan-800"
    }`;

  return (
    <header className="relative z-10 bg-cyan-700 text-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 md:px-8"
      >
        <Link
          to="/"
          className="text-xl font-bold tracking-wide"
          onClick={() => setIsMenuOpen(false)}
        >
          Expense Tracker
        </Link>

        <ul className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={linkClass(item.path)}>
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="rounded-md p-2 hover:bg-cyan-800 md:hidden"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {isMenuOpen && (
        <ul className="space-y-1 px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={linkClass(item.path)}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default Navbar;
