import { NextResponse } from 'next/server';
import { getNews } from '@/lib/finnhub';

export const runtime = 'edge';
export const revalidate = 60;

export async function GET(_request, { params }) {
  const symbol = params.symbol.toUpperCase();
  try {
    const articles = await getNews(symbol);
    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to fetch news' }, { status: 500 });
  }
}
