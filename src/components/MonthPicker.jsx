// value/onChange use 'YYYY-MM' strings, matching the ?month= query param used by the API
export default function MonthPicker({ value, onChange }) {
  return (
    <input
      type="month"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700"
    />
  );
}
