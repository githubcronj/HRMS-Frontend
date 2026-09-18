import { useState } from "react";
import api from "../api/axios";

export default function DownloadAttendanceModal({ candidate, onClose }) {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    setBusy(true);
    const res = await api.get(`/candidates/${candidate._id}/attendance/export`, {
      params: { month },
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${candidate.name}-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setBusy(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-base font-semibold mb-4">
          Download attendance — {candidate.name}
        </h2>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={busy}
            className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white disabled:opacity-60"
          >
            {busy ? "Downloading…" : "Download"}
          </button>
        </div>
      </div>
    </div>
  );
}
