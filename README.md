# Bloomberg-Style Stock Dashboard

Next.js 14 / TailwindCSS dashboard that mirrors a Bloomberg terminal feel using **Finnhub** (free tier) and **Yahoo Finance** (no-key endpoints). Optimized for Vercel Edge Runtime with 60s caching.

## Features
- Live quote overview (price, % change, day range, 52W range, market cap)
- Interactive price chart with 1D/1W/1M/3M/6M/1Y ranges (Yahoo Finance chart API)
- Insider trading table (Finnhub insider transactions)
- Latest headlines (Finnhub general news filtered by symbol)
- Analyst recommendation meter (Finnhub stock recommendations)
- Lightweight Buy / Sell / Hold signal using insiders, analysts, SMA(50), and momentum
- Dark, responsive UI with loading skeletons and graceful error fallbacks

## Project Structure
```
/project-root
  /app
    /api
      /stock/[symbol]/route.js          # Quote + Yahoo fundamentals
      /insider/[symbol]/route.js        # Insider transactions
      /news/[symbol]/route.js           # General news filtered by ticker
      /recommendation/[symbol]/route.js # Analyst sentiment
    /components
      Navbar.js
      SearchBar.js
      StockOverviewCard.js
      InsiderTradesTable.js
      NewsFeed.js
      PriceChart.js
      RatingCard.js
    /dashboard/[symbol]/page.js         # Main dashboard page
    globals.css
    layout.js
    page.js
  /lib
    finnhub.js
    yahoo.js
  .env.local (API keys)
  package.json
  README.md
```

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment**
   Create `.env.local` at the repo root:
   ```bash
   FINNHUB_API_KEY=your_finnhub_api_key_here
   ```
3. **Run locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` and search a ticker (e.g., `AAPL`).

## API Notes
- All API routes use the **Edge Runtime** and `revalidate = 60` for one-minute caching.
- Finnhub endpoints used: `/quote`, `/stock/recommendation`, `/stock/insider-transactions`, `/news?category=general`, `/stock/candle` (via Yahoo for history).
- Yahoo Finance endpoints used: `https://query1.finance.yahoo.com/v8/finance/chart/{symbol}` and `https://query2.finance.yahoo.com/v10/finance/quoteSummary/{symbol}?modules=financialData`.

## Buy / Sell / Hold Model
```
score = 0
if insider buys > insider sells: score += 1
if analyst buy > analyst sell: score += 1
if price > 50-day SMA: score += 1
if price < 50-day SMA: score -= 1
if sentiment positive: score += 1
```
- `score >= 3` → **BUY** (green)
- `score 1-2` → **HOLD** (yellow)
- `score <= 0` → **SELL** (red)

## Deployment (Vercel)
1. Push this repo to GitHub.
2. Create a new Vercel project and import the repo.
3. Add `FINNHUB_API_KEY` in Vercel Environment Variables.
4. Deploy. Edge functions and ISR caching will work out-of-the-box.

## Additional Notes
- UI defaults to dark mode with smooth hover states.
- Error boundaries return friendly messages if any upstream provider fails.
- Recharts powers the area chart; update to candlesticks if desired.
- Data is for demonstration only; always verify before trading.
