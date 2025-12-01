const CHART_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';
const SUMMARY_BASE = 'https://query2.finance.yahoo.com/v10/finance/quoteSummary/';

async function fetchJson(url) {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Yahoo Finance error ${res.status}`);
  }
  return res.json();
}

export async function getYahooChart(symbol, range = '1y', interval = '1d') {
  const url = `${CHART_BASE}${symbol}?range=${range}&interval=${interval}`;
  const data = await fetchJson(url);
  const result = data.chart?.result?.[0];
  if (!result) return { candles: [], meta: {} };

  const timestamps = result.timestamp || [];
  const prices = result.indicators?.quote?.[0]?.close || [];
  const candles = timestamps.map((ts, idx) => ({
    date: new Date(ts * 1000).toISOString(),
    close: prices[idx]
  }));
  return { candles, meta: result.meta || {} };
}

export async function getYahooFinancialData(symbol) {
  const url = `${SUMMARY_BASE}${symbol}?modules=financialData`;
  const data = await fetchJson(url);
  const financialData = data.quoteSummary?.result?.[0]?.financialData || {};
  return financialData;
}
