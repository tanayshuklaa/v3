import Link from 'next/link';

export default function NewsFeed({ articles }) {
  if (!articles) {
    return <div className="card h-64 skeleton" />;
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">News</h2>
        <p className="text-sm text-gray-400">Powered by Finnhub</p>
      </div>
      <div className="space-y-4">
        {articles.slice(0, 10).map((article) => (
          <div key={article.id} className="border border-gray-800 rounded-xl p-4 hover:border-brand/50 transition-colors">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{article.source}</span>
              <span>{new Date(article.datetime * 1000).toLocaleString()}</span>
            </div>
            <Link href={article.url} target="_blank" className="text-lg font-semibold block">
              {article.headline}
            </Link>
            <p className="text-gray-300 text-sm mt-1">{article.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
