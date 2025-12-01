export default function InsiderTradesTable({ trades }) {
  if (!trades) {
    return <div className="card h-64 skeleton" />;
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Insider Trading</h2>
        <p className="text-sm text-gray-400">Last 20 filings</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-gray-400 uppercase tracking-wider text-xs">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Relation</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Shares</th>
              <th className="text-left p-2">Value</th>
              <th className="text-left p-2">Filing</th>
              <th className="text-left p-2">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {trades.slice(0, 20).map((item) => (
              <tr key={`${item.name}-${item.filingDate}-${item.share}`} className="border-t border-gray-800">
                <td className="p-2 font-semibold">{item.name || 'N/A'}</td>
                <td className="p-2 text-gray-300">{item.title || '—'}</td>
                <td className={`p-2 font-semibold ${item.change === 'Increase' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change === 'Increase' ? 'Buy' : 'Sell'}
                </td>
                <td className="p-2">{item.share?.toLocaleString()}</td>
                <td className="p-2">${(item.share * item.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td className="p-2 text-gray-400">{item.filingDate}</td>
                <td className="p-2 text-gray-400">{item.transactionDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
