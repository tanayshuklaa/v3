// /api/candles.js
export default async function handler(req, res) {
  try {
    const { symbol = "AAPL", interval = "1d", range = "1mo" } = req.query;

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.chart || data.chart.error) {
      return res.status(400).json({ error: "Invalid symbol or missing data." });
    }

    const result = data.chart.result[0];

    return res.status(200).json({
      timestamps: result.timestamp,
      open: result.indicators.quote[0].open,
      high: result.indicators.quote[0].high,
      low: result.indicators.quote[0].low,
      close: result.indicators.quote[0].close,
      volume: result.indicators.quote[0].volume
    });

  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
}
