import { useEffect, useState } from "react";
import api from "../../api/axios";
import MonthPicker from "../../components/MonthPicker.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import LogoutTaskModal from "../../components/LogoutTaskModal.jsx";
import logo from "../../assets/logo.png";

function getDatePartsByTimezone(date, timezone) {
  if (!date || !timezone) return null;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(date));

  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

function getDateString(date, timezone) {
  const parts = getDatePartsByTimezone(date, timezone);

  if (!parts) return null;

  return `${parts.year}-${parts.month}-${parts.day}`;
}

function getMonthString(date, timezone) {
  const parts = getDatePartsByTimezone(date, timezone);

  if (!parts) return null;

  return `${parts.year}-${parts.month}`;
}

function formatTime(iso, timezone) {
  if (!iso || !timezone) return "—";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function formatDate(date, timezone) {
  if (!date || !timezone) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatShortDate(date, timezone) {
  if (!date || !timezone) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

function formatAttendanceDate(dateString) {
  if (!dateString) return "—";

  const [year, month, day] = dateString.split("-");

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(Number(year), Number(month) - 1, Number(day)));
}

function formatEffort(minutes) {
  if (!minutes) return "—";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h}h ${m}m`;
}

export default function AttendancePage() {
  const { user, logout } = useAuth();

  const [workTimezone, setWorkTimezone] = useState(null);
  const [today, setToday] = useState(null);
  const [month, setMonth] = useState("");
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  async function loadCandidate() {
    const { data } = await api.get("/candidates/me");

    setWorkTimezone(data.workTimezone);
  }

  async function loadHistory() {
    if (!workTimezone || !month) return;

    const { data } = await api.get("/attendance/me", {
      params: { month },
    });

    setHistory(data);

    const todayStr = getDateString(new Date(), workTimezone);

    const todayRow = data.find((row) => row.attendanceDate === todayStr);

    setToday(todayRow || null);
  }

  useEffect(() => {
    loadCandidate();
  }, []);

  useEffect(() => {
    if (!workTimezone) return;

    setMonth((prev) => {
      if (prev) return prev;

      return getMonthString(new Date(), workTimezone);
    });
  }, [workTimezone]);

  useEffect(() => {
    if (workTimezone && month) {
      loadHistory();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, workTimezone]);

  async function handleLogin() {
    try {
      setBusy(true);

      const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await api.post("/attendance/login", {
        deviceTimezone,
      });

      await loadHistory();
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout(taskSummary) {
    try {
      console.log("coming here");
      setBusy(true);

      const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      await api.post("/attendance/logout", {
        deviceTimezone,
        taskSummary,
      });
      setShowLogoutModal(false);
      await loadHistory();
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: "attendanceDate",
      label: "Date",
      render: (row) => formatAttendanceDate(row.attendanceDate),
    },
    {
      key: "loginTime",
      label: "Login",
      render: (row) => formatTime(row.loginTime, row.workTimezone),
    },
    {
      key: "logoutTime",
      label: "Logout",
      render: (row) => formatTime(row.logoutTime, row.workTimezone),
    },
    ,
    {
      key: "workEffort",
      label: "Work effort",
      render: (row) =>
        row.status === "absent" ? (
          <StatusBadge status="absent" />
        ) : (
          formatEffort(row.workEffortMinutes)
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
        {/* <div className="font-semibold text-gray-900">HRMS</div> */}
        {/* <img src={logo} alt="Logo" className="h-12 mb-6 px-2" /> */}
        <img src={logo} alt="Logo" className="h-14 " />

        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600">{user?.name}</span>

          <button
            onClick={logout}
            className="text-gray-400 hover:text-gray-600"
          >
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600"
            >
              <svg
                width="14"
                height="14"
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
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center mb-6">
          <div className="text-sm text-gray-500 mb-3">
            Today, {formatDate(new Date(), workTimezone)}
          </div>

          <div className="text-2xl font-semibold text-gray-900 mb-3">
            {today?.loginTime
              ? formatTime(today.loginTime, today.workTimezone)
              : "—"}
            <span className="text-sm text-gray-400 font-normal"> login</span>
          </div>

          {!today?.loginTime && (
            <button
              onClick={handleLogin}
              disabled={busy}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60"
            >
              Mark login
            </button>
          )}

          {today?.loginTime && !today?.logoutTime && (
            <button
              onClick={() => setShowLogoutModal(true)}
              disabled={busy}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60"
            >
              Mark logout
            </button>
          )}

          {today?.loginTime && today?.logoutTime && (
            <p className="text-sm text-gray-500">
              Logged out at {formatTime(today.logoutTime, today.workTimezone)}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-gray-700">My attendance</h2>

          <MonthPicker value={month} onChange={setMonth} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <DataTable columns={columns} rows={history} />
          {showLogoutModal && (
            <LogoutTaskModal
              busy={busy}
              onSubmit={handleLogout}
              onClose={() => setShowLogoutModal(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
