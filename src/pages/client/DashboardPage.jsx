import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar.jsx";
import StatCard from "../../components/StatCard.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import ActionsMenu from "../../components/ActionsMenu.jsx";
import Pagination from "../../components/Pagination.jsx";
import DownloadAttendanceModal from "../../components/DownloadAttendanceModal.jsx";

const navItems = [{ label: "Dashboard", to: "/client/dashboard" }];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ activeCount: 0, inactiveCount: 0 });
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [downloadFor, setDownloadFor] = useState(null);

  async function loadSummary() {
    const { data } = await api.get("/dashboard/summary");
    setSummary(data);
  }

  async function loadCandidates() {
    setLoading(true);
    const { data } = await api.get("/candidates", {
      params: {
        page,
        limit,
      },
    });
    setCandidates(data.data);
    setTotal(data.total);
    setLoading(false);
  }

  useEffect(() => {
    loadCandidates();
  }, [page, limit]);

  useEffect(() => {
    loadSummary();
  }, []);

  const columns = [
    {
      key: "employeeCode",
      label: "Employee Code",
      render: (row) => row.employeeCode || "—",
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "designation",
      label: "Designation",
      render: (row) => row.designation || "—",
    },
    {
      key: "workTimezone",
      label: "Work Timezone",
      render: (row) => row.workTimezone || "—",
    },
    {
      key: "joiningDate",
      label: "Joined",
      render: (row) =>
        row.joiningDate ? new Date(row.joiningDate).toLocaleDateString() : "—",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <ActionsMenu
          actions={[
            {
              label: "View Attendance",
              onClick: () => navigate(`/client/candidates/${row._id}`),
            },
            {
              label: "Download",
              onClick: () => setDownloadFor(row),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar title="Client Portal" items={navItems} />

      <main className="flex-1 p-6">
        <h1 className="text-lg font-semibold text-gray-900 mb-4">Dashboard</h1>

        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md">
          <StatCard
            label="Active candidates"
            value={summary.activeCount}
            tone="success"
          />
          <StatCard
            label="Inactive candidates"
            value={summary.inactiveCount}
            tone="muted"
          />
        </div>

        <h2 className="text-sm font-semibold text-gray-700 mb-2">Candidates</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          {loading ? (
            <p className="text-sm text-gray-400 py-6 text-center">Loading…</p>
          ) : (
            <DataTable
              columns={columns}
              rows={candidates}
              // onRowClick={(row) => navigate(`/client/candidates/${row._id}`)}
            />
          )}
          {downloadFor && (
            <DownloadAttendanceModal
              candidate={downloadFor}
              onClose={() => setDownloadFor(null)}
            />
          )}
        </div>
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
      </main>
    </div>
  );
}
