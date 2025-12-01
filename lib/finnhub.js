const BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = process.env.FINNHUB_API_KEY;

async function fetchFinnhub(path, params = {}) {
  if (!API_KEY) {
    throw new Error('FINNHUB_API_KEY is missing. Add it to your .env.local file.');
  }

  const url = new URL(`${BASE_URL}${path}`);
  Object.entries({ ...params, token: API_KEY }).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Finnhub error ${res.status}`);
  }
  return res.json();
}

export async function getQuote(symbol) {
  return fetchFinnhub('/quote', { symbol });
}

export async function getRecommendations(symbol) {
  return fetchFinnhub('/stock/recommendation', { symbol });
}

export async function getInsiderTransactions(symbol) {
  return fetchFinnhub('/stock/insider-transactions', { symbol });
}

export async function getNews(symbol) {
  // Finnhub free tier only supports general news; filter client-side by symbol matches in headline
  const news = await fetchFinnhub('/news', { category: 'general' });
  return news.filter((item) => item.headline?.toUpperCase().includes(symbol.toUpperCase()));
}

export async function getCandle(symbol, { resolution = 'D', from, to }) {
  return fetchFinnhub('/stock/candle', { symbol, resolution, from, to });
}
