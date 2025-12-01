'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [value, setValue] = useState('AAPL');
  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    router.push(`/dashboard/${value.trim().toUpperCase()}`);
  };

  return (
    <form onSubmit={onSubmit} className="w-full flex gap-3">
      <input
        className="flex-1 rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 focus:outline-none focus:border-brand text-white shadow-inner"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search ticker (e.g. AAPL, MSFT, TSLA)"
      />
      <button
        type="submit"
        className="px-5 py-3 rounded-xl bg-brand hover:bg-brand-dark text-black font-semibold transition-colors shadow-card"
      >
        Launch
      </button>
    </form>
  );
}
