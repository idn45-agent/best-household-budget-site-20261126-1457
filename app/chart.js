// Grafik canvas tanpa library: donat pangsa pengeluaran, batang horizontal
// per kategori (terpakai vs pagu), batang berkelompok perbandingan dua bulan,
// dan garis tren tiga bulan. Digambar ulang setiap kali view dirender.

import { rupiahSingkat } from './format.js';

const INK = '#26221a';
const MUTED = '#6b6252';
const TRACK = '#e8dfc9';

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
  const height = wide ? 240 : 216 + rows.length * 24 + 8;
  const ctx = setupCanvas(canvas, width, height);
  const sum = rows.reduce((s, r) => s + r.used, 0) || 1;
  const cx = wide ? 118 : Math.round(width / 2);
  const cy = wide ? 120 : 104;
  const radius = wide ? 92 : 78;
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
  ctx.arc(cx, cy, wide ? 62 : 54, 0, Math.PI * 2);
  ctx.fillStyle = '#fffdf6';
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(rupiahSingkat(total), cx, cy - 10);
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = MUTED;
  ctx.fillText(Math.round((total / Math.max(1, income)) * 100) + '% dari pemasukan', cx, cy + 10);
  // Legenda: kanan (lebar) atau bawah (sempit).
  ctx.textAlign = 'left';
  ctx.font = '13px system-ui, sans-serif';
  rows.forEach((r, i) => {
    const pct = Math.round((r.used / sum) * 100);
    if (wide) {
      const y = 24 + i * 26;
      ctx.fillStyle = r.color;
      ctx.fillRect(246, y - 6, 12, 12);
      ctx.fillStyle = INK;
      ctx.fillText(r.name + ' — ' + pct + '%', 266, y);
    } else {
      const y = 200 + i * 24;
      ctx.fillStyle = r.color;
      ctx.fillRect(8, y - 6, 12, 12);
      ctx.fillStyle = INK;
      ctx.fillText(r.name + ' — ' + pct + '% · ' + rupiahSingkat(r.used), 28, y);
    }
  });
}

// Batang horizontal per kategori: latar pagu krem, batang warna terpakai,
// nilai di kanan. rows: {name, color, used, budget, ratio}
export function drawCategoryBars(canvas, rows) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const rowH = 36;
  const height = rows.length * rowH + 8;
  const ctx = setupCanvas(canvas, width, height);
  const max = Math.max(1, ...rows.map((r) => Math.max(r.used, r.budget)));
  const labelW = 150;
  const valueW = 92;
  const barX = labelW;
  const barW = width - labelW - valueW - 8;
  ctx.font = '13px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH + rowH / 2;
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(r.name, 0, y);
    // Latar pagu.
    ctx.fillStyle = TRACK;
    roundRect(ctx, barX, y - 8, Math.max(2, (r.budget / max) * barW), 16, 4);
    ctx.fill();
    // Realisasi.
    ctx.fillStyle = r.ratio > 1 ? '#b91c1c' : r.color;
    roundRect(ctx, barX, y - 8, Math.max(3, (r.used / max) * barW), 16, 4);
    ctx.fill();
    ctx.fillStyle = r.ratio > 1 ? '#b91c1c' : INK;
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
  const labelW = 150;
  const valueW = 72;
  const barX = labelW;
  const barW = width - labelW - valueW - 8;
  ctx.font = '13px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    ctx.fillStyle = INK;
    ctx.textAlign = 'left';
    ctx.fillText(r.name, 0, y + rowH / 2);
    // Bulan lalu: batang abu-abu tipis di atas.
    ctx.fillStyle = '#c9bda0';
    roundRect(ctx, barX, y + 4, Math.max(2, (r.old / max) * barW), 12, 3);
    ctx.fill();
    // Bulan ini: batang warna di bawah.
    ctx.fillStyle = r.color;
    roundRect(ctx, barX, y + 22, Math.max(2, (r.used / max) * barW), 12, 3);
    ctx.fill();
    ctx.fillStyle = MUTED;
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(rupiahSingkat(r.old), width - 4, y + 10);
    ctx.fillStyle = INK;
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText(rupiahSingkat(r.used), width - 4, y + 28);
    ctx.font = '13px system-ui, sans-serif';
  });
  // Legenda bawah.
  const ly = height - 14;
  ctx.textAlign = 'left';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#c9bda0';
  ctx.fillRect(0, ly - 6, 12, 12);
  ctx.fillStyle = INK;
  ctx.fillText(prevLabel, 16, ly);
  const wPrev = ctx.measureText(prevLabel).width;
  ctx.fillStyle = '#1e3a5f';
  ctx.fillRect(28 + wPrev, ly - 6, 12, 12);
  ctx.fillStyle = INK;
  ctx.fillText(nowLabel, 44 + wPrev, ly);
}

// Garis tren tiga bulan. trend: [{short, expense, cats:{id: used}}].
// Garis tebal = total pengeluaran; tiga garis tipis = tiga kategori dengan
// pengeluaran bulan berjalan terbesar. Nilai ditulis di tiap titik.
export function drawTrendLines(canvas, trend, topCats) {
  const width = canvas.parentElement ? canvas.parentElement.clientWidth : 640;
  const height = 280;
  const ctx = setupCanvas(canvas, width, height);
  const padL = 64;
  const padR = 64;
  const padT = 30;
  const padB = 34;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const allVals = trend.flatMap((t) => [t.expense, ...topCats.map((c) => t.cats[c.id] || 0)]);
  const maxV = Math.max(1, ...allVals);
  const top = Math.ceil(maxV / 5000000) * 5000000;
  const xAt = (i) => padL + (trend.length === 1 ? plotW / 2 : (i / (trend.length - 1)) * plotW);
  const yAt = (v) => padT + plotH - (v / top) * plotH;
  // Garis grid + label sumbu Y.
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let g = 0; g <= 4; g++) {
    const v = (top / 4) * g;
    const y = yAt(v);
    ctx.strokeStyle = g === 0 ? '#b8ab8a' : '#e8dfc9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(width - padR, y);
    ctx.stroke();
    ctx.fillStyle = MUTED;
    ctx.fillText(rupiahSingkat(v), padL - 8, y);
  }
  // Seri: total dulu (paling tebal), lalu kategori. Label legenda dipendekkan
  // (kata pertama) supaya legenda muat di kartu yang sempit.
  const series = [
    { label: 'Total', color: '#1e3a5f', width: 3, vals: trend.map((t) => t.expense) },
    ...topCats.map((c, i) => ({
      label: c.name.split(/[, ]+/)[0],
      color: c.color,
      width: 2,
      vals: trend.map((t) => t.cats[c.id] || 0),
      dash: i === 0 ? [] : [5, 3],
    })),
  ];
  series.forEach((s) => {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.setLineDash(s.dash || []);
    ctx.beginPath();
    s.vals.forEach((v, i) => {
      if (i === 0) ctx.moveTo(xAt(i), yAt(v));
      else ctx.lineTo(xAt(i), yAt(v));
    });
    ctx.stroke();
    ctx.setLineDash([]);
    s.vals.forEach((v, i) => {
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(v), s.width + 2, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(xAt(i), yAt(v), 2, 0, Math.PI * 2);
      ctx.fillStyle = '#fffdf6';
      ctx.fill();
    });
  });
  // Label nilai di atas tiap titik total; label bulan di bawah sumbu.
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  trend.forEach((t, i) => {
    ctx.fillStyle = '#1e3a5f';
    ctx.fillText(rupiahSingkat(t.expense), xAt(i), yAt(t.expense) - 8);
  });
  ctx.font = '12px system-ui, sans-serif';
  ctx.textBaseline = 'top';
  trend.forEach((t, i) => {
    ctx.fillStyle = INK;
    ctx.fillText(t.short + ' 2026', xAt(i), height - padB + 8);
  });
  // Legenda atas.
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = '12px system-ui, sans-serif';
  let lx = padL;
  series.forEach((s) => {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width;
    ctx.beginPath();
    ctx.moveTo(lx, 12);
    ctx.lineTo(lx + 18, 12);
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.fillText(s.label, lx + 24, 12);
    lx += 24 + ctx.measureText(s.label).width + 18;
  });
}
