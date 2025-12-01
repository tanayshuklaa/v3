function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  const key = process.env.FINNHUB_KEY;
  const { symbol } = req.query;

  let url;
  if (symbol) {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 7);
    url = `https://finnhub.io/api/v1/company-news?symbol=${encodeURIComponent(
      symbol
    )}&from=${formatDate(from)}&to=${formatDate(to)}&token=${key}`;
  } else {
    url = `https://finnhub.io/api/v1/news?category=general&token=${key}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("news error:", err);
    return res.status(500).json({ error: "News fetch failed" });
  }
}

