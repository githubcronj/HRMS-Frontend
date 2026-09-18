export default function StatCard({ label, value, tone = 'default' }) {
  const toneClasses = {
    default: 'text-gray-900',
    success: 'text-green-600',
    muted: 'text-gray-500',
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-semibold ${toneClasses[tone]}`}>{value}</div>
    </div>
  );
}
