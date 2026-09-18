import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import ActionsMenu from "../../components/ActionsMenu.jsx";
import Pagination from "../../components/Pagination.jsx";
import DownloadAttendanceModal from "../../components/DownloadAttendanceModal.jsx";

const navItems = [
  { label: "Clients", to: "/superadmin/clients" },
  { label: "Candidates", to: "/superadmin/candidates" },
];

const timezones = [
  { label: "India - Kolkata", value: "Asia/Kolkata" },
  { label: "US - New York", value: "America/New_York" },
  { label: "US - Chicago", value: "America/Chicago" },
  { label: "US - Denver", value: "America/Denver" },
  { label: "US - Los Angeles", value: "America/Los_Angeles" },
  { label: "UK - London", value: "Europe/London" },
  { label: "UAE - Dubai", value: "Asia/Dubai" },
  { label: "Singapore", value: "Asia/Singapore" },
  { label: "Australia - Sydney", value: "Australia/Sydney" },
];

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientFilter, setClientFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [downloadFor, setDownloadFor] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    clientId: "",
    designation: "",
    employeeCode: "",
    joiningDate: "",
    workTimezone: "",
  });

  const navigate = useNavigate();


  async function loadCandidates() {
    setLoading(true);
    const { data } = await api.get("/candidates", {
      params: {
        clientId: clientFilter || undefined,
        status: statusFilter || undefined,
        page,
        limit,
      },
    });
    setCandidates(data.data);
    setTotal(data.total);
    setLoading(false);
  }

  useEffect(() => {
    api.get("/clients").then(({ data }) => setClients(data));
  }, []);


  useEffect(() => {
    loadCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientFilter, statusFilter, page, limit]);

  function resetFilters() {
    setClientFilter("");
    setStatusFilter("");
  }

  async function handleAdd(e) {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      designation: form.designation,
      employeeCode: form.employeeCode,
      joiningDate: form.joiningDate,
      workTimezone: form.workTimezone,
    };

    if (editingId) {
      await api.patch(`/candidates/${editingId}`, payload);
    } else {
      await api.post(`/clients/${form.clientId}/candidates`, payload);
    }

    setForm({
      name: "",
      email: "",
      clientId: "",
      designation: "",
      employeeCode: "",
      joiningDate: "",
      workTimezone: "",
    });

    setShowAdd(false);
    loadCandidates();
  }

  function openEdit(row) {
    setForm({
      name: row.name,
      email: row.email,
      clientId: row.clientId?._id || "",
      designation: row.designation || "",
      employeeCode: row.employeeCode || "",
      joiningDate: row.joiningDate?.slice(0, 10) || "",
      workTimezone: row.workTimezone || "",
    });
    setEditingId(row._id);
    setShowAdd(true);
  }

  async function handleToggleStatus(row) {
    const activating = row.status === "inactive";
    if (!confirm(`${activating ? "Activate" : "Deactivate"} ${row.name}?`))
      return;
    await api.patch(
      `/candidates/${row._id}/${activating ? "activate" : "deactivate"}`,
    );
    loadCandidates();
  }

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
      key: "clientName",
      label: "Client",
      render: (row) => row.clientId?.companyName || "—",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    // {
    //   key: "actions",
    //   label: "Actions",
    //   render: (row) => (
    //     <ActionsMenu
    //       actions={[
    //         { label: "Edit", onClick: () => openEdit(row) },
    //         {
    //           label: "Deactivate",
    //           onClick: () => handleDeactivate(row),
    //           danger: true,
    //         },
    //       ]}
    //     />
    //   ),
    // },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <ActionsMenu
          actions={[
            { label: "Edit", onClick: () => openEdit(row) },
            {
              label: "View Attendance",
              onClick: () =>
                navigate(`/superadmin/candidates/${row._id}/attendance`),
            },
            {
              label: "Download",
              onClick: () => setDownloadFor(row),
            },
            {
              label: row.status === "inactive" ? "Activate" : "Deactivate",
              onClick: () => handleToggleStatus(row),
              danger: row.status !== "inactive",
              success: row.status === "inactive",
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex">
      <Sidebar title="HRMS" items={navItems} />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-900">Candidates</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Add candidate
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={resetFilters}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            Reset
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          {loading ? (
            <p className="text-sm text-gray-400 py-6 text-center">Loading…</p>
          ) : (
            <DataTable columns={columns} rows={candidates} />
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

        {showAdd && (
          <div className="fixed inset-0 bg-black/30 grid place-items-center">
            <form
              onSubmit={handleAdd}
              className="bg-white rounded-xl p-6 w-full max-w-sm"
            >
              <h2 className="text-base font-semibold mb-4">Add candidate</h2>
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
              />
              <select
                required
                value={form.clientId}
                onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
              >
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.companyName}
                  </option>
                ))}
              </select>
              <input
                placeholder="Designation"
                value={form.designation}
                onChange={(e) =>
                  setForm({ ...form, designation: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
              />

              <input
                placeholder="Employee code"
                value={form.employeeCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    employeeCode: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
              />

              <input
                type="date"
                value={form.joiningDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    joiningDate: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
              />

              <select
                required
                value={form.workTimezone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    workTimezone: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
              >
                <option value="">Select work timezone</option>

                {timezones.map((timezone) => (
                  <option key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 text-sm rounded-lg text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {downloadFor && (
          <DownloadAttendanceModal
            candidate={downloadFor}
            onClose={() => setDownloadFor(null)}
          />
        )}
      </main>
    </div>
  );
}
