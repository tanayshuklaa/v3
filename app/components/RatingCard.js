export default function RatingCard({ recommendation, signal }) {
  if (!recommendation) {
    return <div className="card h-48 skeleton" />;
  }

  const latest = recommendation[0] || {};
  const bars = [
    { label: 'Strong Buy', value: latest.strongBuy || 0, color: 'bg-emerald-500' },
    { label: 'Buy', value: latest.buy || 0, color: 'bg-green-500' },
    { label: 'Hold', value: latest.hold || 0, color: 'bg-yellow-400' },
    { label: 'Sell', value: latest.sell || 0, color: 'bg-orange-400' },
    { label: 'Strong Sell', value: latest.strongSell || 0, color: 'bg-red-500' }
  ];

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Analyst Rating</p>
          <h2 className="text-2xl font-semibold">{latest.period || 'N/A'}</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${signal.color}`}>{signal.label}</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {bars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-3">
            <div className="w-24 text-sm text-gray-300">{bar.label}</div>
            <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
              <div className={`${bar.color} h-full`} style={{ width: `${Math.min(bar.value * 10, 100)}%` }} />
            </div>
            <div className="w-12 text-right text-sm font-semibold">{bar.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
