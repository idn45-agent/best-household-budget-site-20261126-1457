// Grafik canvas tanpa library: donat pangsa pengeluaran, batang horizontal
// per kategori (terpakai vs pagu), dan batang berkelompok perbandingan dua
// bulan. Digambar ulang setiap kali view dirender.

import { rupiahSingkat } from './format.js';

function setupCanvas(canvas, cssW, cssH) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.width = cssW + 'px';
  canvas.style.height = cssH + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function roundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

// Donat pangsa pengeluaran. rows: {name, color, used} terurut menurun.
// Tengah donat menampilkan total dan pangsanya dari pemasukan.
// Lebar >= 480: legenda di kanan donat. Lebih sempit (ponsel): legenda di
// bawah donat supaya tidak terpotong.
export function drawDonut(canvas, rows, total, income) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const wide = width >= 480;
  const height = wide ? 240 : 240 + rows.length * 24 + 8;
  const ctx = setupCanvas(canvas, width, height);
  const sum = rows.reduce((s, r) => s + r.used, 0) || 1;
  const cx = wide ? 120 : Math.round(width / 2);
  const cy = wide ? 120 : 108;
  const radius = wide ? 92 : 80;
  let angle = -Math.PI / 2;
  rows.forEach((r) => {
    const sweep = (r.used / sum) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = r.color;
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, wide ? 64 : 56, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = '#1b2a22';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(rupiahSingkat(total), cx, cy - 9);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(Math.round((total / Math.max(1, income)) * 100) + '% dari pemasukan', cx, cy + 11);
  // Legenda: kanan (lebar) atau bawah (sempit).
  ctx.textAlign = 'left';
  ctx.font = '13px system-ui, sans-serif';
  rows.forEach((r, i) => {
    const pct = Math.round((r.used / sum) * 100);
    if (wide) {
      const y = 24 + i * 26;
      ctx.fillStyle = r.color;
      ctx.fillRect(250, y - 6, 12, 12);
      ctx.fillStyle = '#374151';
      ctx.fillText(r.name + ' — ' + pct + '%', 270, y);
    } else {
      const y = 216 + i * 24;
      ctx.fillStyle = r.color;
      ctx.fillRect(8, y - 6, 12, 12);
      ctx.fillStyle = '#374151';
      ctx.fillText(r.name + ' — ' + pct + '% · ' + rupiahSingkat(r.used), 28, y);
    }
  });
}

// Batang horizontal per kategori: latar pagu abu-abu, batang warna terpakai,
// nilai di kanan. rows: {name, color, used, budget, ratio}
export function drawCategoryBars(canvas, rows) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const rowH = 36;
  const height = rows.length * rowH + 8;
  const ctx = setupCanvas(canvas, width, height);
  const max = Math.max(1, ...rows.map((r) => Math.max(r.used, r.budget)));
  const labelW = 140;
  const valueW = 92;
  const barX = labelW;
  const barW = width - labelW - valueW - 8;
  ctx.font = '13px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH + rowH / 2;
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    ctx.fillText(r.name, 0, y);
    // Latar pagu.
    ctx.fillStyle = '#ece5d3';
    roundRect(ctx, barX, y - 8, (r.budget / max) * barW, 16, 4);
    ctx.fill();
    // Realisasi.
    ctx.fillStyle = r.ratio > 1 ? '#c2410c' : r.color;
    roundRect(ctx, barX, y - 8, Math.max(3, (r.used / max) * barW), 16, 4);
    ctx.fill();
    ctx.fillStyle = r.ratio > 1 ? '#c2410c' : '#1b2a22';
    ctx.font = (r.ratio > 1 ? 'bold ' : '') + '12px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(rupiahSingkat(r.used), width - 4, y);
    ctx.font = '13px system-ui, sans-serif';
  });
}

// Batang berkelompok: bulan lalu vs bulan ini per kategori.
// rows: {name, color, old, used} — dua batang per kategori.
export function drawCompareBars(canvas, rows, prevLabel, nowLabel) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const rowH = 44;
  const height = rows.length * rowH + 34;
  const ctx = setupCanvas(canvas, width, height);
  const max = Math.max(1, ...rows.flatMap((r) => [r.old, r.used]));
  const labelW = 140;
  const valueW = 66;
  const barX = labelW;
  const barW = width - labelW - valueW - 8;
  ctx.font = '13px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    ctx.fillText(r.name, 0, y + rowH / 2);
    // Bulan lalu: batang abu-abu tipis di atas.
    ctx.fillStyle = '#c9c2ae';
    roundRect(ctx, barX, y + 4, Math.max(2, (r.old / max) * barW), 12, 3);
    ctx.fill();
    // Bulan ini: batang warna di bawah.
    ctx.fillStyle = r.color;
    roundRect(ctx, barX, y + 22, Math.max(2, (r.used / max) * barW), 12, 3);
    ctx.fill();
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(rupiahSingkat(r.old), width - 4, y + 10);
    ctx.fillStyle = '#1b2a22';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(rupiahSingkat(r.used), width - 4, y + 28);
    ctx.font = '13px system-ui, sans-serif';
  });
  // Legenda bawah.
  const ly = height - 14;
  ctx.textAlign = 'left';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#c9c2ae';
  ctx.fillRect(0, ly - 6, 12, 12);
  ctx.fillStyle = '#374151';
  ctx.fillText(prevLabel, 16, ly);
  const wPrev = ctx.measureText(prevLabel).width;
  ctx.fillStyle = '#0e5e3f';
  ctx.fillRect(28 + wPrev, ly - 6, 12, 12);
  ctx.fillStyle = '#374151';
  ctx.fillText(nowLabel, 44 + wPrev, ly);
}
