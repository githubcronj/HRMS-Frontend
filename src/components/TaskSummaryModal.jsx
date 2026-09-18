export default function TaskSummaryModal({ date, task, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-base font-semibold mb-2">
          Task summary for {date}
        </h2>
        {/* <p className="text-xs text-gray-400 mb-3">{date}</p> */}
        <hr className="border-gray-300 mb-4" />
        <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
          {task || "No task summary submitted."}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-brand-600 text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
