import { NextResponse } from 'next/server';
import { getInsiderTransactions } from '@/lib/finnhub';

export const runtime = 'edge';
export const revalidate = 60;

export async function GET(_request, { params }) {
  const symbol = params.symbol.toUpperCase();
  try {
    const data = await getInsiderTransactions(symbol);
    return NextResponse.json(data.data || [], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to fetch insider transactions' }, { status: 500 });
  }
}
