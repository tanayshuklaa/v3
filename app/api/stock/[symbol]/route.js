import { NextResponse } from 'next/server';
import { getQuote } from '@/lib/finnhub';
import { getYahooChart, getYahooFinancialData } from '@/lib/yahoo';

export const runtime = 'edge';
export const revalidate = 60;

export async function GET(_request, { params }) {
  const symbol = params.symbol.toUpperCase();
  try {
    const [quote, { candles, meta }, financialData] = await Promise.all([
      getQuote(symbol),
      getYahooChart(symbol, '1y', '1d'),
      getYahooFinancialData(symbol)
    ]);

    const change = quote.c && quote.pc ? ((quote.c - quote.pc) / quote.pc) * 100 : null;
    const response = {
      symbol,
      current: quote.c,
      prevClose: quote.pc,
      high: quote.h,
      low: quote.l,
      open: quote.o,
      change,
      candles,
      meta,
      financialData,
      fiftyTwoWeekHigh: meta?.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: meta?.fiftyTwoWeekLow,
      marketCap: financialData?.marketCap?.raw || null
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to fetch quote' }, { status: 500 });
  }
}
