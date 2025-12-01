'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useMemo, useState } from 'react';

const ranges = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365
};

export default function PriceChart({ data }) {
  const [range, setRange] = useState('3M');

  const filtered = useMemo(() => {
    if (!data || data.length === 0) return [];
    const days = ranges[range];
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const subset = data.filter((d) => new Date(d.date).getTime() >= cutoff);
    return subset.length > 1 ? subset : data.slice(-Math.max(2, subset.length));
  }, [data, range]);

  if (!data || data.length === 0) {
    return <div className="card h-72 skeleton" />;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-gray-400">Price Performance</p>
          <h2 className="text-2xl font-semibold">{data[data.length - 1]?.close?.toFixed(2)}</h2>
        </div>
        <div className="flex gap-2 text-xs">
          {Object.keys(ranges).map((key) => (
            <button
              key={key}
              onClick={() => setRange(key)}
              className={`px-3 py-1 rounded-full border transition-colors ${range === key ? 'border-brand bg-brand/20 text-brand' : 'border-gray-800 text-gray-300 hover:border-brand/50'}`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filtered} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString()} stroke="#6b7280" />
            <YAxis domain={['dataMin', 'dataMax']} stroke="#6b7280" tickFormatter={(v) => `$${v.toFixed(0)}`} />
            <Tooltip
              contentStyle={{ background: '#0b1220', border: '1px solid #111827', borderRadius: '12px' }}
              labelFormatter={(v) => new Date(v).toLocaleString()}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Close']}
            />
            <Area type="monotone" dataKey="close" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
