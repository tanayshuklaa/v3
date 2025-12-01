// script.js
async function loadDashboard() {
  const symbol = "AAPL";

  loadQuote(symbol);
  loadNews(symbol);
  loadCandles(symbol);
}

async function loadQuote(symbol) {
  const res = await fetch(`/api/quote?symbol=${symbol}`);
  const data = await res.json();

  document.getElementById("price").innerText = `$${data.price}`;
  document.getElementById("change").innerText = `${data.change.toFixed(2)} (${data.percent.toFixed(2)}%)`;
}

async function loadNews(symbol) {
  const res = await fetch(`/api/news?symbol=${symbol}`);
  const items = await res.json();

  const newsBox = document.getElementById("news");
  newsBox.innerHTML = "";

  items.slice(0, 10).forEach(article => {
    newsBox.innerHTML += `
      <div class="news-item">
        <a href="${article.link}" target="_blank">${article.title}</a>
      </div>
    `;
  });
}

async function loadCandles(symbol) {
  const res = await fetch(`/api/candles?symbol=${symbol}&interval=1d&range=1mo`);
  const data = await res.json();

  const timestamps = data.timestamps.map(t => new Date(t * 1000));
  const candles = timestamps.map((t, i) => ({
    x: t,
    o: data.open[i],
    h: data.high[i],
    l: data.low[i],
    c: data.close[i],
  }));

  const sma20 = movingAverage(data.close, 20);
  const sma50 = movingAverage(data.close, 50);

  const ctx = document.getElementById("chart").getContext("2d");

  new Chart(ctx, {
    type: "candlestick",
    data: {
      datasets: [
        {
          label: `${symbol} Candles`,
          data: candles
        },
        {
          label: "SMA 20",
          data: sma20.map((v, i) => ({ x: timestamps[i], y: v })),
          borderColor: "blue",
          type: "line"
        },
        {
          label: "SMA 50",
          data: sma50.map((v, i) => ({ x: timestamps[i], y: v })),
          borderColor: "red",
          type: "line"
        }
      ]
    }
  });
}

function movingAverage(arr, period) {
  return arr.map((val, idx, full) => {
    if (idx < period) return null;
    const slice = full.slice(idx - period, idx);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

loadDashboard();


