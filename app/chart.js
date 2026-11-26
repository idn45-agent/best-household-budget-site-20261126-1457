// Grafik canvas tanpa library: batang horizontal pengeluaran per kategori
// dan donat pangsa pengeluaran. Digambar ulang setiap kali view dirender.

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

// Batang horizontal: label kiri, batang, nilai kanan. rows: {name, color, used, budget}
export function drawBarChart(canvas, rows) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const rowH = 34;
  const height = rows.length * rowH + 8;
  const ctx = setupCanvas(canvas, width, height);
  const max = Math.max(1, ...rows.map((r) => Math.max(r.used, r.budget)));
  const labelW = 132;
  const valueW = 86;
  const barX = labelW;
  const barW = width - labelW - valueW - 8;
  ctx.font = '13px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH + rowH / 2;
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    ctx.fillText(r.name, 0, y);
    // Latar pagu (anggaran) sebagai batang tipis abu-abu.
    ctx.fillStyle = '#e7e0cf';
    roundRect(ctx, barX, y - 8, (r.budget / max) * barW, 16, 4);
    ctx.fill();
    // Realisasi sebagai batang warna.
    ctx.fillStyle = r.color;
    roundRect(ctx, barX, y - 8, Math.max(3, (r.used / max) * barW), 16, 4);
    ctx.fill();
    ctx.fillStyle = r.ratio > 1 ? '#b91c1c' : '#111827';
    ctx.font = (r.ratio > 1 ? 'bold ' : '') + '12px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(rupiahSingkat(r.used), width - 4, y);
    ctx.font = '13px system-ui, sans-serif';
  });
}

// Donat pangsa pengeluaran dengan legenda di kanan.
export function drawDonut(canvas, rows) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const height = 220;
  const ctx = setupCanvas(canvas, width, height);
  const total = rows.reduce((s, r) => s + r.used, 0) || 1;
  const cx = 110;
  const cy = 110;
  const radius = 84;
  let angle = -Math.PI / 2;
  rows.forEach((r) => {
    const sweep = (r.used / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = r.color;
    ctx.fill();
    angle += sweep;
  });
  ctx.beginPath();
  ctx.arc(cx, cy, 52, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100%', cx, cy - 8);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText('pengeluaran', cx, cy + 12);
  // Legenda.
  ctx.textAlign = 'left';
  ctx.font = '13px system-ui, sans-serif';
  rows.forEach((r, i) => {
    const y = 22 + i * 26;
    ctx.fillStyle = r.color;
    ctx.fillRect(228, y - 6, 12, 12);
    ctx.fillStyle = '#374151';
    const pct = Math.round((r.used / total) * 100);
    ctx.fillText(r.name + ' — ' + pct + '%', 248, y);
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
