// columns: [{ key, label, render?: (row) => node }]
export default function DataTable({
  columns,
  rows,
  onRowClick,
  emptyText = "No records found",
}) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        {/* <tr className="text-left text-gray-500 border-b border-gray-200"> */}
        <tr className="text-left text-gray-700 bg-gray-50 border-b border-gray-400">
          {columns.map((col) => (
            <th key={col.key} className="py-2 px-3 font-medium">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td
              colSpan={columns.length}
              className="py-6 px-3 text-center text-gray-400"
            >
              {emptyText}
            </td>
          </tr>
        )}
        {rows.map((row, i) => (
          <tr
            key={row.id || i}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={`border-b border-gray-100 ${
              onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
            }`}
          >
            {columns.map((col) => (
              <td key={col.key} className="py-2.5 px-3 text-gray-700">
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
