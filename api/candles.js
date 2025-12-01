export default async function handler(req, res) {
    const { symbol, resolution = "D" } = req.query;
    const key = process.env.FINNHUB_KEY;

    if (!symbol) {
        return res.status(400).json({ error: "Missing symbol" });
    }

    // Finnhub requires UNIX timestamps
    const now = Math.floor(Date.now() / 1000);  // current time
    const from = now - 60 * 60 * 24 * 365;      // past 1 year of data

    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${now}&token=${key}`;

    try {
        const data = await fetch(url).then(r => r.json());

        // Finnhub returns s = "no_data" if no candles exist
        if (data.s === "no_data" || !data.c) {
            return res.status(404).json({ error: "No candle data for this symbol" });
        }

        return res.status(200).json(data);

    } catch (err) {
        console.error("Candle fetch error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}


