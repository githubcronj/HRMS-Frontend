import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import MonthPicker from "../../components/MonthPicker.jsx";
import ActionsMenu from "../../components/ActionsMenu.jsx";
import TaskSummaryModal from "../../components/TaskSummaryModal.jsx";
import Pagination from "../../components/Pagination.jsx";

const navItems = [{ label: "Dashboard", to: "/client/dashboard" }];

function currentMonth() {
  return new Date().toISOString().slice(0, 7); // 'YYYY-MM'
}

function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatEffort(minutes) {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export default function CandidateDetailPage() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [month, setMonth] = useState(currentMonth());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingTask, setViewingTask] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await api.get(`/candidates/${candidateId}/attendance`, {
        params: { month, page, limit },
      });
      setCandidate(data.candidate);
      setRows(data.attendance);
      setTotal(data.total);
      setLoading(false);
    }
    load();
  }, [candidateId, month, page, limit]);

  useEffect(() => setPage(1), [month]);

  const columns = [
    {
      key: "date",
      label: "Date",
      render: (row) =>
        new Date(row.attendanceDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
    },
    {
      key: "loginTime",
      label: "Login",
      render: (row) => formatTime(row.loginTime),
    },
    {
      key: "logoutTime",
      label: "Logout",
      render: (row) => formatTime(row.logoutTime),
    },
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
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <ActionsMenu
          actions={[{ label: "View Task", onClick: () => setViewingTask(row) }]}
        />
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar title="Client Portal" items={navItems} />
      <main className="flex-1 p-6">
        <button
          onClick={() => navigate("/client/dashboard")}
          className="text-sm text-gray-500 hover:text-gray-700 mb-8"
        >
          ← Back to candidates
        </button>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-900">
            {candidate?.name || "…"}{" "}
            <span className="text-gray-400 font-normal">— Monthly Report</span>
          </h1>
          <MonthPicker value={month} onChange={setMonth} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          {loading ? (
            <p className="text-sm text-gray-400 py-6 text-center">Loading…</p>
          ) : (
            <>
              <DataTable columns={columns} rows={rows} />
              <Pagination
                page={page}
                limit={limit}
                total={total}
                onPageChange={setPage}
                onLimitChange={(n) => {
                  setLimit(n);
                  setPage(1);
                }}
              />
              {viewingTask && (
                <TaskSummaryModal
                  date={new Date(viewingTask.attendanceDate).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                    },
                  )}
                  task={viewingTask.taskSummary}
                  onClose={() => setViewingTask(null)}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
