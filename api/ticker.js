export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=20, stale-while-revalidate=40");

  const key = process.env.FINNHUB_KEY;
  const symbols = ["AAPL", "TSLA", "NVDA", "AMZN", "MSFT", "SPY", "QQQ"];

  try {
    const data = await Promise.all(
      symbols.map(async (symbol) => {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`;
        const resp = await fetch(url);
        const json = await resp.json();
        return { symbol, ...json };
      })
    );

    return res.status(200).json(data);
  } catch (err) {
    console.error("ticker error:", err);
    return res.status(500).json({ error: "Ticker fetch failed" });
  }
}

