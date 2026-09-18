import { useState } from "react";

export default function LogoutTaskModal({ onSubmit, onClose, busy }) {
  const [task, setTask] = useState("");

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-base font-semibold mb-2">
          What did you work on today?
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          A short summary before you log out.
        </p>
        <textarea
          required
          rows={4}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. Fixed pagination bug, reviewed PR #42"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 resize-none"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg text-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(task)}
            disabled={busy || !task.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white disabled:opacity-60"
          >
            {busy ? "Logging out…" : "Submit & log out"}
          </button>
        </div>
      </div>
    </div>
  );
}
