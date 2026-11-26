// View: semua halaman dirender dari state (store.js) ke dalam #view.
// Rute hash: #/ dasbor, #/anggaran, #/transaksi, #/kategori/<id>,
// #/tujuan, #/laporan. Setiap view memakai angka nyata dari data.

import { CATEGORIES, FAMILY, SAVINGS_TARGET } from './data.js';
import { esc, persen, rupiah, rupiahSingkat, tanggalSingkat } from './format.js';
import {
  budgetTotals,
  categoryRows,
  currentMonth,
  goalRows,
  monthLabel,
  monthSummary,
  nextMonth,
  prevMonth,
  savingsTotal,
  transactionsFor,
} from './store.js';
import { drawBarChart, drawDonut } from './chart.js';

function catById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function chip(cat) {
  return '<span class="chip" style="background:' + cat.color + '">' + cat.short + '</span>';
}

function progressBar(ratio, color) {
  const pct = Math.min(100, Math.round(ratio * 100));
  const over = ratio > 1;
  return (
    '<div class="bar" role="img" aria-label="' + pct + ' persen terpakai">' +
    '<div class="bar-fill' + (over ? ' over' : '') + '" style="width:' + pct + '%;' +
    (color && !over ? 'background:' + color : '') + '"></div></div>'
  );
}

function monthNav() {
  const prev = prevMonth(currentMonth);
  const next = nextMonth(currentMonth);
  return (
    '<div class="monthnav">' +
    (prev
      ? '<a class="mn-btn" href="#/" data-month="' + prev + '">‹ ' + monthLabel(prev) + '</a>'
      : '<span class="mn-btn disabled">‹ Sebelumnya</span>') +
    '<strong class="mn-now">' + monthLabel(currentMonth) + '</strong>' +
    (next
      ? '<a class="mn-btn" href="#/" data-month="' + next + '">' + monthLabel(next) + ' ›</a>'
      : '<span class="mn-btn disabled">Berikutnya ›</span>') +
    '</div>'
  );
}

function txRow(t) {
  const cat = t.cat ? catById(t.cat) : null;
  return (
    '<tr>' +
    '<td class="d">' + tanggalSingkat(t.date) + '</td>' +
    '<td>' + (cat ? chip(cat) + ' ' : '') + esc(t.desc) + '</td>' +
    '<td class="cat">' + (cat ? esc(cat.name) : 'Pemasukan') + '</td>' +
    '<td class="num ' + (t.kind === 'in' ? 'in' : 'out') + '">' +
    (t.kind === 'in' ? '+ ' : '− ') + rupiah(t.amount) + '</td>' +
    '<td><button class="del" data-action="del-tx" data-id="' + t.id + '" title="Hapus transaksi ini">Hapus</button></td>' +
    '</tr>'
  );
}

function txTable(rows, emptyText) {
  if (!rows.length) return '<p class="empty">' + emptyText + '</p>';
  return (
    '<table class="tx"><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th>' +
    '<th class="num">Jumlah</th><th></th></tr></thead><tbody>' +
    rows.map(txRow).join('') +
    '</tbody></table>'
  );
}

// ---------------- Dasbor ----------------

export function viewDashboard(state) {
  const s = monthSummary(currentMonth, state);
  const rows = categoryRows(currentMonth, state).sort((a, b) => b.used - a.used);
  const goals = goalRows(state);
  const recent = transactionsFor(currentMonth, state).slice(0, 5);
  const over = rows.filter((r) => r.ratio > 1);
  const under = rows.filter((r) => r.ratio <= 0.85);
  const note =
    over.length > 0
      ? 'Perhatian: ' + over.map((r) => r.name).join(', ') + ' sudah melewati pagu bulan ini.'
      : 'Semua kategori masih dalam pagu. ' +
        (under.length ? under[0].name + ' baru terpakai ' + persen(under[0].ratio) + ' dari pagu.' : '');
  return (
    '<section class="hero"><div><h1>Anggaran ' + monthLabel(currentMonth) + '</h1>' +
    '<p class="sub">' + esc(FAMILY.name) + ' · ' + esc(FAMILY.members) + ' · ' + esc(FAMILY.city) + '</p></div>' +
    monthNav() + '</section>' +
    '<section class="cards">' +
    '<div class="card sum in"><span class="lbl">Pemasukan</span><strong>' + rupiah(s.income) + '</strong>' +
    '<span class="note">Gaji Budi &amp; Sari + jualan kue</span></div>' +
    '<div class="card sum out"><span class="lbl">Pengeluaran</span><strong>' + rupiah(s.expense) + '</strong>' +
    '<span class="note">' + persen(s.expense / Math.max(1, s.income)) + ' dari pemasukan</span></div>' +
    '<div class="card sum rest"><span class="lbl">Sisa bulan ini</span><strong>' + rupiah(s.rest) + '</strong>' +
    '<span class="note">Tabungan ' + rupiah(s.saving) + ' · bebas ' + rupiah(s.free) + '</span></div>' +
    '</section>' +
    '<div class="grid2">' +
    '<section class="card"><h2>Pengeluaran per kategori</h2>' +
    '<canvas id="chart-bars" height="280" aria-label="Grafik batang pengeluaran per kategori"></canvas>' +
    '<p class="hint">Batang warna = terpakai, batang abu-abu = pagu. ' + esc(note) + '</p></section>' +
    '<section class="card"><h2>Anggaran bulan ini</h2>' +
    rows.slice(0, 5).map((r) =>
      '<a class="budget-row" href="#/kategori/' + r.id + '">' + chip(r) +
      '<span class="bname">' + esc(r.name) + '</span>' +
      '<span class="bnums">' + rupiahSingkat(r.used) + ' / ' + rupiahSingkat(r.budget) + '</span>' +
      progressBar(r.ratio, r.color) + '<span class="bpct">' + persen(r.ratio) + '</span></a>'
    ).join('') +
    '<p class="more"><a href="#/anggaran">Lihat semua anggaran &amp; ubah pagu →</a></p></section>' +
    '</div>' +
    '<div class="grid2">' +
    '<section class="card"><h2>Tujuan tabungan</h2>' +
    goals.slice(0, 2).map((g) =>
      '<div class="goal-mini"><div><strong>' + esc(g.name) + '</strong><span>' + rupiah(g.saved) +
      ' dari ' + rupiah(g.target) + '</span></div>' + progressBar(g.ratio, '#2e7d4f') +
      '<span class="bpct">' + persen(g.ratio) + '</span></div>'
    ).join('') +
    '<p class="more"><a href="#/tujuan">Semua tujuan tabungan →</a></p></section>' +
    '<section class="card"><h2>Transaksi terbaru</h2>' +
    txTable(recent, 'Belum ada transaksi bulan ini.') +
    '<p class="more"><a href="#/transaksi">Semua transaksi &amp; tambah baru →</a></p></section>' +
    '</div>'
  );
}

export function afterDashboard(state) {
  const rows = categoryRows(currentMonth, state).sort((a, b) => b.used - a.used);
  const canvas = document.getElementById('chart-bars');
  if (canvas) drawBarChart(canvas, rows);
}

// ---------------- Anggaran ----------------

export function viewBudget(state) {
  const rows = categoryRows(currentMonth, state);
  const totals = budgetTotals(currentMonth, state);
  return (
    '<section class="hero"><div><h1>Anggaran ' + monthLabel(currentMonth) + '</h1>' +
    '<p class="sub">Total pagu ' + rupiah(totals.budget) + ' · terpakai ' + rupiah(totals.used) +
    ' · sisa pagu ' + rupiah(totals.budget - totals.used) + '. Ubah pagu lalu tekan Simpan.</p></div>' +
    monthNav() + '</section>' +
    '<section class="card"><table class="budget"><thead><tr><th>Kategori</th><th>Pagu (Rp)</th>' +
    '<th class="num">Terpakai</th><th class="num">Sisa</th><th style="width:26%">Progres</th><th></th></tr></thead><tbody>' +
    rows.map((r) =>
      '<tr><td><a class="catlink" href="#/kategori/' + r.id + '">' + chip(r) + ' ' + esc(r.name) + '</a></td>' +
      '<td><input class="budget-input" type="number" min="0" step="50000" value="' + r.budget +
      '" data-cat="' + r.id + '" aria-label="Pagu ' + esc(r.name) + '"></td>' +
      '<td class="num">' + rupiah(r.used) + '</td>' +
      '<td class="num ' + (r.left < 0 ? 'over-txt' : '') + '">' + rupiah(r.left) + '</td>' +
      '<td>' + progressBar(r.ratio, r.color) + '<span class="bpct">' + persen(r.ratio) + '</span></td>' +
      '<td><button class="btn small" data-action="save-budget" data-cat="' + r.id + '">Simpan</button></td></tr>'
    ).join('') +
    '</tbody></table>' +
    '<p class="hint">Di luar delapan kategori ini, keluarga menyisihkan ' + rupiah(SAVINGS_TARGET) +
    ' per bulan untuk tabungan — lihat <a href="#/tujuan">Tujuan Tabungan</a>.</p></section>'
  );
}

// ---------------- Transaksi ----------------

export function viewTransactions(state) {
  const all = transactionsFor(currentMonth, state);
  return (
    '<section class="hero"><div><h1>Transaksi ' + monthLabel(currentMonth) + '</h1>' +
    '<p class="sub">' + all.length + ' transaksi · pemasukan ' + rupiah(monthSummary(currentMonth, state).income) +
    ' · pengeluaran ' + rupiah(monthSummary(currentMonth, state).expense) + '</p></div>' +
    monthNav() + '</section>' +
    '<section class="card"><h2>Tambah transaksi</h2>' +
    '<form id="add-tx" class="form">' +
    '<label>Tanggal<input type="date" name="date" value="2026-11-26" required></label>' +
    '<label>Jenis<select name="kind"><option value="out">Pengeluaran</option><option value="in">Pemasukan</option></select></label>' +
    '<label>Kategori<select name="cat">' +
    CATEGORIES.map((c) => '<option value="' + c.id + '">' + esc(c.name) + '</option>').join('') +
    '</select></label>' +
    '<label>Keterangan<input type="text" name="desc" maxlength="80" placeholder="cth. Pasar Minggu — sayur" required></label>' +
    '<label>Jumlah (Rp)<input type="number" name="amount" min="1000" step="1000" placeholder="150000" required></label>' +
    '<button class="btn" type="submit">Simpan transaksi</button>' +
    '<span class="form-msg" id="add-msg" role="status"></span>' +
    '</form></section>' +
    '<section class="card"><h2>Daftar transaksi</h2>' +
    '<div class="filters"><label>Cari <input type="search" id="tx-search" placeholder="cth. pasar, listrik"></label>' +
    '<label>Kategori <select id="tx-filter"><option value="">Semua kategori</option>' +
    '<option value="__in">Pemasukan</option>' +
    CATEGORIES.map((c) => '<option value="' + c.id + '">' + esc(c.name) + '</option>').join('') +
    '</select></label></div>' +
    '<div id="tx-list">' + txTable(all, 'Belum ada transaksi bulan ini.') + '</div>' +
    '<p class="hint">Transaksi yang kamu tambah tersimpan di perangkat ini. ' +
    '<button class="linkbtn" data-action="reset-data">Muat ulang data contoh</button></p></section>'
  );
}

// ---------------- Halaman kategori ----------------

export function viewCategory(state, catId) {
  const cat = catById(catId);
  if (!cat) return '<section class="card"><h1>Kategori tidak ditemukan</h1><p><a href="#/anggaran">Kembali ke Anggaran</a></p></section>';
  const rows = categoryRows(currentMonth, state);
  const row = rows.find((r) => r.id === catId);
  const prev = prevMonth(currentMonth);
  const prevRows = prev ? categoryRows(prev, state) : [];
  const prevUsed = prev ? (prevRows.find((r) => r.id === catId) || { used: 0 }).used : 0;
  const txs = transactionsFor(currentMonth, state).filter((t) => t.cat === catId);
  const delta = row.used - prevUsed;
  return (
    '<section class="hero"><div><h1>' + chip(cat) + ' ' + esc(cat.name) + '</h1>' +
    '<p class="sub">' + monthLabel(currentMonth) + ' · pagu ' + rupiah(row.budget) + '</p></div>' +
    monthNav() + '</section>' +
    '<section class="cards">' +
    '<div class="card sum"><span class="lbl">Pagu</span><strong>' + rupiah(row.budget) + '</strong></div>' +
    '<div class="card sum out"><span class="lbl">Terpakai</span><strong>' + rupiah(row.used) + '</strong>' +
    '<span class="note">' + persen(row.ratio) + ' dari pagu</span></div>' +
    '<div class="card sum rest"><span class="lbl">Sisa pagu</span><strong>' + rupiah(row.left) + '</strong>' +
    '<span class="note">' + (prev ? 'Bulan lalu terpakai ' + rupiah(prevUsed) + ' (' +
    (delta >= 0 ? '+' : '−') + rupiah(Math.abs(delta)) + ')' : '') + '</span></div>' +
    '</section>' +
    '<section class="card"><h2>Progres pagu</h2>' + progressBar(row.ratio, cat.color) +
    '<p class="hint">' + (row.ratio > 1
      ? 'Pagu terlampaui ' + rupiah(-row.left) + ' — kurangi belanja kategori ini sampai akhir bulan.'
      : row.ratio > 0.85
        ? 'Hampir habis: sisa ' + rupiah(row.left) + ' untuk sisa bulan ini.'
        : 'Masih aman: sisa ' + rupiah(row.left) + ' dari pagu.') + '</p></section>' +
    '<section class="card"><h2>Transaksi ' + esc(cat.name) + ' — ' + monthLabel(currentMonth) + '</h2>' +
    txTable(txs, 'Belum ada transaksi kategori ini bulan ini.') +
    '<p class="more"><a href="#/transaksi">Tambah transaksi kategori ini →</a> · ' +
    '<a href="#/anggaran">← Semua anggaran</a></p></section>'
  );
}

// ---------------- Tujuan tabungan ----------------

export function viewGoals(state) {
  const goals = goalRows(state);
  const totalSaved = savingsTotal(state);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  return (
    '<section class="hero"><div><h1>Tujuan Tabungan</h1>' +
    '<p class="sub">Terkumpul ' + rupiah(totalSaved) + ' dari total target ' + rupiah(totalTarget) +
    ' · disisihkan ' + rupiah(SAVINGS_TARGET) + ' setiap bulan.</p></div></section>' +
    '<div class="goals">' +
    goals.map((g) =>
      '<section class="card goal"><h2>' + esc(g.name) + '</h2>' +
      '<p class="sub">' + esc(g.detail) + '</p>' +
      '<div class="goal-nums"><strong>' + rupiah(g.saved) + '</strong><span>dari ' + rupiah(g.target) + '</span></div>' +
      progressBar(g.ratio, '#2e7d4f') +
      '<p class="goal-left">' + persen(g.ratio) + ' tercapai · kurang ' + rupiah(g.left) + '</p>' +
      '<form class="goal-form" data-goal="' + g.id + '">' +
      '<label>Tambah dana (Rp)<input type="number" name="amount" min="1000" step="1000" placeholder="100000" required></label>' +
      '<button class="btn small" type="submit">Tambah</button></form></section>'
    ).join('') +
    '</div>' +
    '<section class="card"><h2>Cara keluarga menabung</h2><ol class="tips">' +
    '<li>Setiap tanggal 1, begitu gaji masuk, ' + rupiah(SAVINGS_TARGET) + ' langsung dipindah ke rekening tabungan sebelum belanja.</li>' +
    '<li>Dana darurat didahulukan sampai penuh, baru kelebihan dialihkan ke liburan dan renovasi dapur.</li>' +
    '<li>Sisa pagu kategori di akhir bulan ikut masuk ke dana darurat — November ini belanja harian masih menyisakan pagu.</li>' +
    '</ol></section>'
  );
}

// ---------------- Laporan ----------------

export function viewReport(state) {
  const rows = categoryRows(currentMonth, state).sort((a, b) => b.used - a.used);
  const prev = prevMonth(currentMonth);
  const prevRows = prev ? categoryRows(prev, state) : [];
  const prevUsed = (id) => (prevRows.find((r) => r.id === id) || { used: 0 }).used;
  const s = monthSummary(currentMonth, state);
  const prevS = prev ? monthSummary(prev, state) : null;
  const top = transactionsFor(currentMonth, state).filter((t) => t.kind === 'out')
    .sort((a, b) => b.amount - a.amount).slice(0, 5);
  return (
    '<section class="hero"><div><h1>Laporan ' + monthLabel(currentMonth) + '</h1>' +
    '<p class="sub">Bandingkan dengan ' + (prev ? monthLabel(prev) : '—') + ' dan lihat ke mana uang keluarga pergi.</p></div>' +
    monthNav() + '</section>' +
    '<div class="grid2">' +
    '<section class="card"><h2>Pangsa pengeluaran</h2>' +
    '<canvas id="chart-donut" height="220" aria-label="Grafik donat pangsa pengeluaran per kategori"></canvas></section>' +
    '<section class="card"><h2>Pengeluaran terbesar bulan ini</h2><ol class="toplist">' +
    top.map((t) => '<li><span>' + esc(t.desc) + ' <em>' + tanggalSingkat(t.date) + '</em></span><strong>' + rupiah(t.amount) + '</strong></li>').join('') +
    '</ol><p class="hint">Tiga besar adalah kewajiban tetap: SPP anak, cicilan motor, dan listrik.</p></section>' +
    '</div>' +
    '<section class="card"><h2>Perbandingan per kategori</h2>' +
    '<table class="cmp"><thead><tr><th>Kategori</th><th class="num">' + (prev ? monthLabel(prev) : '') +
    '</th><th class="num">' + monthLabel(currentMonth) + '</th><th class="num">Selisih</th></tr></thead><tbody>' +
    rows.map((r) => {
      const d = r.used - prevUsed(r.id);
      return '<tr><td><a class="catlink" href="#/kategori/' + r.id + '">' + chip(r) + ' ' + esc(r.name) +
        '</a></td><td class="num">' + rupiah(prevUsed(r.id)) + '</td><td class="num">' + rupiah(r.used) +
        '</td><td class="num ' + (d > 0 ? 'over-txt' : 'good-txt') + '">' + (d >= 0 ? '+' : '−') + rupiah(Math.abs(d)) + '</td></tr>';
    }).join('') +
    '<tr class="total"><td><strong>Total pengeluaran</strong></td><td class="num"><strong>' +
    (prevS ? rupiah(prevS.expense) : '—') + '</strong></td><td class="num"><strong>' + rupiah(s.expense) +
    '</strong></td><td class="num"><strong>' + (prevS ? (s.expense - prevS.expense >= 0 ? '+' : '−') +
    rupiah(Math.abs(s.expense - prevS.expense)) : '—') + '</strong></td></tr>' +
    '</tbody></table>' +
    '<h3>Yang bisa diperbaiki bulan depan</h3><ol class="tips">' +
    '<li><strong>Makan di luar turun ' + rupiah(prevUsed('makan') - rows.find((r) => r.id === 'makan').used) +
    ' dari bulan lalu</strong> — masak bekal tiga kali seminggu terbukti menghemat.</li>' +
    '<li><strong>Transportasi turun ' + rupiah(prevUsed('transport') - rows.find((r) => r.id === 'transport').used) +
    '</strong> — Budi mulai naik KRL dua hari seminggu.</li>' +
    '<li><strong>Belanja harian masih ' + rupiah(rows.find((r) => r.id === 'belanja').left) +
    ' di bawah pagu</strong> — sisa pagu bisa dialihkan ke dana darurat di akhir bulan.</li>' +
    '</ol></section>'
  );
}

export function afterReport(state) {
  const rows = categoryRows(currentMonth, state).sort((a, b) => b.used - a.used);
  const canvas = document.getElementById('chart-donut');
  if (canvas) drawDonut(canvas, rows);
}
