export default function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const hasNext = end < total;
  const hasPrev = page > 1;

  return (
    <div className="flex justify-end items-center gap-4 pt-3 text-sm text-gray-500">
      <div className="flex items-center gap-2">
        <span>Rows per page:</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-gray-300 hover:bg-gray-100 rounded-lg px-2 py-1"
        >
          {[3, 5, 10, 25, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <span>{start}–{end} of {total}</span>
      <div className="flex gap-1">
        <button
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          className="px-2 py-1 rounded disabled:opacity-30 hover:bg-gray-100"
        >
          ‹
        </button>
        <button
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          className="px-2 py-1 rounded disabled:opacity-30 hover:bg-gray-100"
        >
          ›
        </button>
      </div>
    </div>
  );
}
