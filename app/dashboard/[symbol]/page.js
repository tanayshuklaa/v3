import StockOverviewCard from '@/app/components/StockOverviewCard';
import PriceChart from '@/app/components/PriceChart';
import InsiderTradesTable from '@/app/components/InsiderTradesTable';
import NewsFeed from '@/app/components/NewsFeed';
import RatingCard from '@/app/components/RatingCard';
import { getQuote, getInsiderTransactions, getNews, getRecommendations } from '@/lib/finnhub';
import { getYahooChart, getYahooFinancialData } from '@/lib/yahoo';
import Link from 'next/link';

export const revalidate = 60;

function computeSignal({ insiders = [], recommendation = [], currentPrice, sma50, change }) {
  let score = 0;

  const buyCount = insiders.filter((item) => item.change === 'Increase').length;
  const sellCount = insiders.filter((item) => item.change === 'Decrease').length;
  if (buyCount > sellCount) score += 1;

  const rec = recommendation[0] || {};
  if ((rec.buy || 0) + (rec.strongBuy || 0) > (rec.sell || 0) + (rec.strongSell || 0)) score += 1;

  if (sma50 && currentPrice) {
    if (currentPrice > sma50) score += 1;
    if (currentPrice < sma50) score -= 1;
  }

  if (change !== undefined && change !== null) {
    if (change > 0) score += 1;
  }

  let label = 'HOLD';
  let color = 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40';
  if (score >= 3) {
    label = 'BUY';
    color = 'bg-green-500/20 text-green-300 border border-green-500/30';
  } else if (score <= 0) {
    label = 'SELL';
    color = 'bg-red-500/20 text-red-300 border border-red-500/40';
  }

  return { score, label, color };
}

async function fetchData(symbol) {
  const [quote, insiders, recommendation, news, { candles, meta }, financialData] = await Promise.all([
    getQuote(symbol),
    getInsiderTransactions(symbol).then((res) => res.data || []),
    getRecommendations(symbol),
    getNews(symbol),
    getYahooChart(symbol, '1y', '1d'),
    getYahooFinancialData(symbol)
  ]);

  const change = quote.c && quote.pc ? ((quote.c - quote.pc) / quote.pc) * 100 : null;
  const closes = candles.map((c) => c.close).filter(Boolean);
  const sma50 = closes.length >= 50 ? closes.slice(-50).reduce((a, b) => a + b, 0) / 50 : null;

  return {
    overview: {
      symbol,
      current: quote.c,
      high: quote.h,
      low: quote.l,
      open: quote.o,
      prevClose: quote.pc,
      change,
      fiftyTwoWeekHigh: meta?.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: meta?.fiftyTwoWeekLow,
      marketCap: financialData?.marketCap?.raw || null
    },
    insiders,
    recommendation,
    news,
    candles,
    meta,
    sma50,
    change
  };
}

export default async function DashboardPage({ params }) {
  const symbol = params.symbol.toUpperCase();

  try {
    const data = await fetchData(symbol);
    const signal = computeSignal({
      insiders: data.insiders,
      recommendation: data.recommendation,
      currentPrice: data.overview.current,
      sma50: data.sma50,
      change: data.change
    });

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">Dashboard</p>
            <h1 className="text-3xl font-bold">{symbol}</h1>
            <p className="text-gray-400 text-sm">Data refreshed every minute from Finnhub and Yahoo Finance.</p>
          </div>
          <Link href="/" className="text-sm text-brand hover:text-brand-dark">Search another ticker</Link>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <StockOverviewCard data={data.overview} />
            <PriceChart data={data.candles} />
            <div className="grid md:grid-cols-2 gap-4">
              <RatingCard recommendation={data.recommendation} signal={signal} />
              <div className={`card border ${signal.color} flex flex-col justify-between`}>
                <div>
                  <p className="text-sm text-gray-400">Signal</p>
                  <h2 className="text-3xl font-bold">{signal.label}</h2>
                  <p className="text-gray-300 text-sm mt-2">
                    Score {signal.score} / 4 based on insider flows, analyst sentiment, 50-day SMA, and price momentum.
                  </p>
                </div>
                {data.sma50 && (
                  <p className="text-xs text-gray-400 mt-4">Current Price: ${data.overview.current?.toFixed(2)} | 50-day SMA: ${
                    data.sma50?.toFixed(2)
                  }</p>
                )}
              </div>
            </div>
            <InsiderTradesTable trades={data.insiders} />
          </div>
          <div className="space-y-4">
            <NewsFeed articles={data.news} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="card text-center space-y-3">
        <h1 className="text-2xl font-semibold">Unable to load {symbol}</h1>
        <p className="text-gray-400">{error.message}</p>
        <Link href="/" className="text-brand">Go back</Link>
      </div>
    );
  }
}
