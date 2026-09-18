const styles = {
  active: 'bg-green-50 text-green-700',
  inactive: 'bg-red-50 text-red-600',
  present: 'bg-green-50 text-green-700',
  absent: 'bg-red-50 text-red-600',
  'half-day': 'bg-amber-50 text-amber-700',
  'on-leave': 'bg-gray-100 text-gray-600',
};

export default function StatusBadge({ status }) {
  const key = (status || '').toLowerCase();
  const cls = styles[key] || 'bg-gray-100 text-gray-600';
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';

  return (
    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
