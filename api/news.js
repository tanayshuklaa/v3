// /api/news.js
export default async function handler(req, res) {
  try {
    const { symbol = "AAPL" } = req.query;

    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${symbol}`;
    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data.news || []);
  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
}
