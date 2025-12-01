'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-black font-bold">SB</div>
          <div>
            <p className="text-lg font-semibold leading-tight">StreetBeat Terminal</p>
            <p className="text-xs text-gray-400">Finnhub + Yahoo Finance</p>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/" className={pathname === '/' ? 'text-white font-semibold' : ''}>
            Home
          </Link>
          <Link href="/dashboard/AAPL" className={pathname?.includes('/dashboard') ? 'text-white font-semibold' : ''}>
            Dashboard
          </Link>
          <a href="https://finnhub.io" target="_blank" rel="noreferrer" className="text-brand">
            Finnhub Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
