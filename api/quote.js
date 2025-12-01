// /api/quote.js
export default async function handler(req, res) {
  try {
    const { symbol = "AAPL" } = req.query;

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`;
    const response = await fetch(url);
    const data = await response.json();

    const q = data.quoteResponse.result[0];

    return res.status(200).json({
      symbol: q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange,
      percent: q.regularMarketChangePercent,
      high: q.regularMarketDayHigh,
      low: q.regularMarketDayLow,
      open: q.regularMarketOpen,
      previousClose: q.regularMarketPreviousClose
    });

  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
}
