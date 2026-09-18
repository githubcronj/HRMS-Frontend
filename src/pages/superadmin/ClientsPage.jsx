import { useEffect, useState } from "react";
import api from "../../api/axios";
import Sidebar from "../../components/Sidebar.jsx";
import DataTable from "../../components/DataTable.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import ActionsMenu from "../../components/ActionsMenu.jsx";

const navItems = [
  { label: "Clients", to: "/superadmin/clients" },
  { label: "Candidates", to: "/superadmin/candidates" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactEmail: "",
    contactPhone: "",
  });

  async function loadClients() {
    setLoading(true);
    const { data } = await api.get("/clients");
    setClients(data);
    setLoading(false);
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    await api.post("/clients", form);
    setForm({ companyName: "", contactEmail: "", contactPhone: "" });
    setShowAdd(false);
    loadClients();
  }

  async function handleToggleStatus(row) {
    console.log("this is row", row);
    const activating = row.status === "inactive";
    if (
      !confirm(`${activating ? "Activate" : "Deactivate"} ${row.companyName}?`)
    )
      return;
    await api.patch(
      `/clients/${row._id}/${activating ? "activate" : "deactivate"}`,
    );
    loadClients();
  }

  const columns = [
    { key: "companyName", label: "Client name" },
    { key: "contactEmail", label: " Email" },
    { key: "contactPhone", label: "Phone" },
    {
      key: "candidates",
      label: "Candidates",
      render: (row) =>
        `${row.activeCandidateCount || 0} active / ${row.inactiveCandidateCount || 0} inactive`,
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
          <h1 className="text-lg font-semibold text-gray-900">Clients</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Add client
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          {loading ? (
            <p className="text-sm text-gray-400 py-6 text-center">Loading…</p>
          ) : (
            <DataTable columns={columns} rows={clients} />
          )}
        </div>

        {showAdd && (
          <div className="fixed inset-0 bg-black/30 grid place-items-center">
            <form
              onSubmit={handleAdd}
              className="bg-white rounded-xl p-6 w-full max-w-sm"
            >
              <h2 className="text-base font-semibold mb-4">Add client</h2>
              <input
                required
                placeholder="Company name"
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
              />
              <input
                required
                type="email"
                placeholder="Contact email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm({ ...form, contactEmail: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
              />
              <input
                placeholder="Contact phone"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm({ ...form, contactPhone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
              />
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
      </main>
    </div>
  );
}
