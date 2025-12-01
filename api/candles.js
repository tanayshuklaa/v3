export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=240");

  const key = process.env.FINNHUB_KEY;
  const { symbol, resolution = "D" } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Symbol is required" });
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const daysBack =
    resolution === "60" ? 60 :
    resolution === "15" ? 20 :
    resolution === "5"  ? 7  :
    365; // D or default

  const fromSec = nowSec - daysBack * 24 * 60 * 60;

  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${encodeURIComponent(
    symbol
  )}&resolution=${encodeURIComponent(
    resolution
  )}&from=${fromSec}&to=${nowSec}&token=${key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.s !== "ok") {
      console.error("candles status:", data);
      return res.status(400).json({ error: "No candle data for this symbol" });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("candles error:", err);
    return res.status(500).json({ error: "Candles fetch failed" });
  }
}

