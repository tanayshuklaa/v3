/* ============================
   Trader Dash Frontend
   - Uses /api/* (Vercel backend)
   - Real candles + SMA20 + RSI14
   - Buy / Hold / Sell signal
============================ */

function fmt(n, d = 2) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return Number(n).toFixed(d);
}

async function fetchJSON(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch ${url} failed: ${res.status}`);
  return res.json();
}

/* ---------- Live Ticker ---------- */

async function loadTicker() {
  try {
    const data = await fetchJSON("/api/ticker");
    const el = document.getElementById("liveTicker");
    let text = "";

    data.forEach((q) => {
      if (!q || q.c === undefined || !q.pc) return;
      const changePct = ((q.c - q.pc) / q.pc) * 100;
      const arrow = changePct >= 0 ? "▲" : "▼";
      const color = changePct >= 0 ? "var(--good)" : "var(--bad)";
      text += `<span style="margin-right:20px;color:${color}">
        ${q.symbol}: $${fmt(q.c)} ${arrow} ${fmt(changePct)}%
      </span>`;
    });

    el.innerHTML = text || "No ticker data.";
  } catch (err) {
    console.error("ticker error:", err);
    document.getElementById("liveTicker").innerHTML = "Error loading tickers";
  }
}
loadTicker();
setInterval(loadTicker, 20000); // 20s refresh

/* ---------- Chart setup ---------- */

let chart, candleSeries, smaSeries;

function initChart() {
  const container = document.getElementById("chart");
  container.innerHTML = "";
  chart = LightweightCharts.createChart(container, {
    layout: { background: { color: "#081126" }, textColor: "#dfefff" },
    grid: {
      vertLines: { color: "rgba(255,255,255,0.05)" },
      horzLines: { color: "rgba(255,255,255,0.05)" }
    },
    rightPriceScale: { borderColor: "rgba(255,255,255,0.15)" },
    timeScale: { borderColor: "rgba(255,255,255,0.15)" }
  });
  candleSeries = chart.addCandlestickSeries();
}

/* ---------- Indicator math ---------- */

function calcSMA(candles, period) {
  if (!candles || candles.length < period) return [];
  const res = [];
  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += candles[j].close;
    res.push({ time: candles[i].time, value: sum / period });
  }
  return res;
}

function calcRSI(candles, period = 14) {
  if (!candles || candles.length <= period) return [];
  let gains = 0,
    losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses += -diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  const out = [];
  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    const gain = Math.max(diff, 0);
    const loss = Math.max(-diff, 0);
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    out.push({ time: candles[i].time, value: rsi });
  }
  return out;
}

/* ---------- Recommendation logic ---------- */
/*
  Very simple rules:
  - Compute:
      current price = last close
      52w high/low from candles
      SMA20
      RSI14
  - BUY  if price < SMA20 && RSI < 35 && near 52w low
  - SELL if price > SMA20 && RSI > 65 && near 52w high
  - else HOLD
*/

function makeRecommendation(current, sma20Last, rsiLast, hi52, lo52) {
  if (!current || !sma20Last || !rsiLast || !hi52 || !lo52) return "HOLD";

  const distanceToLow = (current - lo52) / lo52;
  const distanceToHigh = (hi52 - current) / hi52;

  if (current < sma20Last && rsiLast < 35 && distanceToLow < 0.1) return "BUY";
  if (current > sma20Last && rsiLast > 65 && distanceToHigh < 0.1) return "SELL";
  return "HOLD";
}

/* ---------- Load one symbol ---------- */

let lastSymbol = null;
let lastLoadTime = 0;

async function loadSymbol(symbol) {
  symbol = symbol.trim().toUpperCase();
  if (!symbol) return;

  const now = Date.now();
  if (symbol === lastSymbol && now - lastLoadTime < 4000) return; // basic throttle
  lastSymbol = symbol;
  lastLoadTime = now;

  document.getElementById("chartTitle").innerText = `${symbol} • Chart`;
  document.getElementById("quoteBox").innerText = "Loading...";
  document.getElementById("indicatorBox").innerText = "Loading...";
  document.getElementById("signalBox").innerText = "Loading...";
  document.getElementById("newsFeed").innerText = "Loading...";

  const resolution = document.getElementById("timeframe").value || "D";

  try {
    const [quote, candleData] = await Promise.all([
      fetchJSON(`/api/quote?symbol=${encodeURIComponent(symbol)}`),
      fetchJSON(`/api/candles?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}`)
    ]);

    const candles = candleData.t.map((t, i) => ({
      time: candleData.t[i],
      open: candleData.o[i],
      high: candleData.h[i],
      low: candleData.l[i],
      close: candleData.c[i],
      volume: candleData.v[i]
    }));

    // Chart
    candleSeries.setData(candles);

    // Indicators
    const sma20 = calcSMA(candles, 20);
    const rsi14 = calcRSI(candles, 14);
    if (smaSeries) chart.removeSeries(smaSeries);
    smaSeries = chart.addLineSeries({ color: "#ffb86b", lineWidth: 1 });
    smaSeries.setData(sma20);

    const current = candles[candles.length - 1]?.close;
    const smaLast = sma20.length ? sma20[sma20.length - 1].value : null;
    const rsiLast = rsi14.length ? rsi14[rsi14.length - 1].value : null;
    const closes = candles.map(c => c.close);
    const hi52 = Math.max(...closes);
    const lo52 = Math.min(...closes);

    // Quote panel
    document.getElementById("quoteBox").innerHTML = `
      <div style="font-size:1.6rem;font-weight:700;margin-bottom:4px;">
        $${fmt(quote.c)}
      </div>
      <div>Open: ${fmt(quote.o)} • High: ${fmt(quote.h)} • Low: ${fmt(
        quote.l
      )}</div>
      <div>Prev close: ${fmt(quote.pc)} • Volume: ${fmt(quote.v, 0)}</div>
      <div>52w High: ${fmt(hi52)} • 52w Low: ${fmt(lo52)}</div>
    `;

    // Indicator panel
    document.getElementById("indicatorBox").innerHTML = `
      <div>SMA 20: ${smaLast ? fmt(smaLast) : "—"}</div>
      <div>RSI 14: ${rsiLast ? fmt(rsiLast) : "—"}</div>
    `;

    // Recommendation
    const rec = makeRecommendation(current, smaLast, rsiLast, hi52, lo52);
    const box = document.getElementById("signalBox");
    box.innerText = rec;
    box.style.color =
      rec === "BUY"
        ? "var(--good)"
        : rec === "SELL"
        ? "var(--bad)"
        : "var(--hold)";

    // News (company-specific if possible, else general)
    let news = await fetchJSON(`/api/news?symbol=${encodeURIComponent(symbol)}`);
    if (!news.length) {
      news = await fetchJSON("/api/news");
    }
    document.getElementById("newsFeed").innerHTML = news
      .slice(0, 8)
      .map(
        (n) => `
        <div class="news-item">
          <strong>${n.headline}</strong><br>
          <small>${n.source || ""}</small>
        </div>`
      )
      .join("");
  } catch (err) {
    console.error("loadSymbol error:", err);
    document.getElementById("signalBox").innerText = "Error";
    document.getElementById("quoteBox").innerText = "Failed to load data.";
  }
}

/* ---------- UI wiring ---------- */

document.addEventListener("DOMContentLoaded", () => {
  initChart();
  const symbolInput = document.getElementById("symbolInput");
  const loadBtn = document.getElementById("loadBtn");
  const timeframe = document.getElementById("timeframe");

  loadBtn.addEventListener("click", () =>
    loadSymbol(symbolInput.value || "AAPL")
  );
  symbolInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") loadSymbol(symbolInput.value || "AAPL");
  });
  timeframe.addEventListener("change", () =>
    loadSymbol(symbolInput.value || "AAPL")
  );

  symbolInput.value = "AAPL";
  loadSymbol("AAPL");
});

