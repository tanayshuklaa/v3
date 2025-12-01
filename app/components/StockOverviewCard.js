export default function StockOverviewCard({ data }) {
  if (!data) {
    return <div className="card h-44 skeleton" />;
  }

  const rows = [
    { label: 'Current Price', value: `$${data.current?.toFixed(2)}` },
    { label: 'Change %', value: `${data.change?.toFixed(2)}%`, positive: data.change >= 0 },
    { label: 'Day High / Low', value: `$${data.high?.toFixed(2)} / $${data.low?.toFixed(2)}` },
    { label: 'Open / Prev Close', value: `$${data.open?.toFixed(2)} / $${data.prevClose?.toFixed(2)}` },
    { label: '52 Week High / Low', value: `$${data.fiftyTwoWeekHigh?.toFixed(2)} / $${data.fiftyTwoWeekLow?.toFixed(2)}` },
    { label: 'Market Cap', value: data.marketCap ? `$${(data.marketCap / 1e9).toFixed(2)}B` : 'N/A' }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400">Overview</p>
          <h2 className="text-2xl font-semibold">{data.symbol}</h2>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${data.change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
          {data.change >= 0 ? 'Bullish' : 'Bearish'}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="bg-gray-800/50 rounded-xl p-3 border border-gray-800">
            <p className="text-gray-400">{row.label}</p>
            <p className={`text-lg font-semibold ${row.positive === undefined ? '' : row.positive ? 'text-green-400' : 'text-red-400'}`}>
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
