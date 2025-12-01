import SearchBar from './components/SearchBar';
import Link from 'next/link';

export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-6">
      <div className="max-w-3xl space-y-4">
        <p className="inline-flex px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-semibold border border-brand/20">Powered by Finnhub & Yahoo Finance</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Bloomberg-style equity dashboard for everyone</h1>
        <p className="text-lg text-gray-300">
          Search any ticker to see live quotes, analyst sentiment, insider trades, headlines, and price action. Optimized for
          Vercel Edge and the free Finnhub/Yahoo tiers.
        </p>
      </div>
      <div className="w-full max-w-xl">
        <SearchBar />
      </div>
      <div className="text-sm text-gray-400 space-y-1">
        <p>Try examples: <Link href="/dashboard/AAPL">AAPL</Link>, <Link href="/dashboard/MSFT">MSFT</Link>, <Link href="/dashboard/TSLA">TSLA</Link></p>
        <p className="text-xs">Data refreshed every minute. Charts and recommendations are for demo purposes only.</p>
      </div>
    </div>
  );
}
