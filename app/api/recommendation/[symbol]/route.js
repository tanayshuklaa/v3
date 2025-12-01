import { NextResponse } from 'next/server';
import { getRecommendations } from '@/lib/finnhub';

export const runtime = 'edge';
export const revalidate = 60;

export async function GET(_request, { params }) {
  const symbol = params.symbol.toUpperCase();
  try {
    const data = await getRecommendations(symbol);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to fetch analyst recommendations' }, { status: 500 });
  }
}
