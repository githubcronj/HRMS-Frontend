import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext.jsx";

// items: [{ label, to, icon: <svg/> }]
export default function Sidebar({ title, items }) {
  const { logout } = useAuth();
  return (
    // <aside className="w-56 shrink-0 bg-white border-r border-gray-200 min-h-screen p-4">
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
      {/* <img src={logo} alt={title} className="h-12 mb-6 px-2" /> */}
      <img src={logo} alt={title} className="h-14 mb-6 px-2 self-start" />
      <nav className="flex-1 flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    </aside>
  );
}
