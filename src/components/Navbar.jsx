import { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Items for homepage scroll
  const sectionLinks = [
    { name: "Home", path: "/#hero" },
    { name: "Campaigns", path: "/#featured-campaigns" },
    { name: "Impact", path: "/#impact-stats" },
    { name: "Testimonials", path: "/#testimonials" },
  ];

  // Items for actual routes
  const pageLinks = [
    { name: "Donor Login", path: "/donor-login" },
    { name: "NGO Login", path: "/ngo-login" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-rose-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7 text-rose-500"
          >
            <path d="M20.8 4.6c-1.8-1.9-4.8-1.9-6.6 0L12 6.8l-2.2-2.2c-1.8-1.9-4.8-1.9-6.6 0s-1.8 5 0 6.9l8.8 9 8.8-9c1.8-1.9 1.8-5 0-6.9z" />
          </svg>
          <span className="font-bold text-xl text-gray-800">
            <Link to="/">AidConnect+</Link>
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-[15px] text-gray-700 md:flex">
          {/* Section Links (scroll) */}
          {sectionLinks.map((item) => (
            <HashLink
              key={item.name}
              smooth
              to={item.path}
              className="hover:text-rose-500"
            >
              {item.name}
            </HashLink>
          ))}
          {/* Page Links (navigate) */}
          {pageLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="hover:text-rose-500"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/donor-signup"
            className="px-4 py-2 rounded-md bg-rose-500 text-white font-medium hover:bg-rose-600 ml-2"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden inline-flex items-center rounded-md border border-rose-500 px-3 py-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                !open
                  ? "M4 6h16M4 12h16M4 18h16"
                  : "M6 18L18 6M6 6l12 12"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-teal-100 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
            {/* Section Links */}
            {sectionLinks.map((item) => (
              <HashLink
                key={item.name}
                smooth
                to={item.path}
                className="block rounded-md px-3 py-2 hover:bg-rose-100"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </HashLink>
            ))}
            {/* Page Links */}
            {pageLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block rounded-md px-3 py-2 hover:bg-rose-100"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/get-started"
              className="block text-center px-4 py-2 rounded-md bg-rose-500 text-white font-medium hover:bg-rose-500"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
