// View: semua halaman dirender dari state (store.js) ke dalam #view.
// Rute hash: #/ dasbor, #/anggaran, #/transaksi, #/kategori,
// #/kategori/<id>, #/tujuan, #/laporan. Setiap view memakai angka nyata
// dari data; wawasan dihitung insights.js dari angka yang sama.

import { CATEGORIES, FAMILY, SAVINGS_TARGET } from './data.js';
import { deltaPersen, deltaRupiah, esc, persen, rupiah, rupiahSingkat, tanggalSingkat } from './format.js';
import {
  budgetAlerts,
  buildInsights,
  nearBudget,
} from './insights.js';
import {
  budgetTotals,
  categoryRows,
  compareRows,
  currentMonth,
  goalRows,
  monthLabel,
  monthShort,
  monthSummary,
  nextMonth,
  prevMonth,
  savingsTotal,
  topExpenses,
  transactionsFor,
} from './store.js';
import { drawCategoryBars, drawCompareBars, drawDonut } from './chart.js';

function catById(id) {
  return CATEGORIES.find((c) => c.id === id);
}

// Singkatan dua huruf dari nama kategori ("Belanja Harian" -> "BH").
function shortOf(name) {
  const words = name.split(/[^A-Za-z]+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function chip(cat) {
  return '<span class="chip" style="background:' + cat.color + '">' + shortOf(cat.name) + '</span>';
}

function statusBadge(status) {
  if (status === 'lewat') return '<span class="badge bad">Melebihi</span>';
  if (status === 'hati-hati') return '<span class="badge warn">Hati-hati</span>';
  return '<span class="badge ok">Aman</span>';
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

function budgetRowLink(r) {
  return (
    '<a class="budget-row" href="#/kategori/' + r.id + '">' + chip(r) +
    '<span class="bname">' + esc(r.name) + '</span>' +
    '<span class="bnums">' + rupiahSingkat(r.used) + ' / ' + rupiahSingkat(r.budget) + '</span>' +
    progressBar(r.ratio, r.color) + '<span class="bpct">' + persen(r.ratio) + '</span>' +
    statusBadge(r.status) + '</a>'
  );
}

// ---------------- Dasbor ----------------

export function viewDashboard(state) {
  const s = monthSummary(currentMonth, state);
  const rows = categoryRows(currentMonth, state).sort((a, b) => b.used - a.used);
  const goals = goalRows(state);
  const recent = transactionsFor(currentMonth, state).slice(0, 5);
  const alerts = budgetAlerts(currentMonth, state);
  const near = nearBudget(currentMonth, state);
  const insights = buildInsights(currentMonth, state);
  const top3 = rows.slice(0, 3);
  const alertHtml = alerts.length
    ? '<section class="alert"><strong>Perhatian — ' + alerts.length + ' kategori melewati pagu:</strong> ' +
      alerts.map((r) => esc(r.name) + ' ' + rupiahSingkat(r.used) + ' dari pagu ' + rupiahSingkat(r.budget) +
        ' (lebih ' + rupiahSingkat(-r.left) + ')').join(' · ') +
      ' <a href="#/anggaran">Atur pagu →</a></section>'
    : '';
  return (
    '<section class="hero"><div><p class="eyebrow">' + esc(FAMILY.name) + ' · ' + esc(FAMILY.city) + '</p>' +
    '<h1>Anggaran ' + monthLabel(currentMonth) + '</h1>' +
    '<p class="sub">Uang masuk, uang keluar, dan sisanya — semua tercatat di perangkat ini.</p></div>' +
    monthNav() + '</section>' +
    alertHtml +
    '<section class="cards">' +
    '<div class="card sum in"><span class="lbl">Pemasukan</span><strong>' + rupiah(s.income) + '</strong>' +
    '<span class="note">Gaji Budi &amp; Sari + jualan online</span></div>' +
    '<div class="card sum out"><span class="lbl">Pengeluaran</span><strong>' + rupiah(s.expense) + '</strong>' +
    '<span class="note">' + persen(s.spendRate) + ' dari pemasukan · ' +
    transactionsFor(currentMonth, state).filter((t) => t.kind === 'out').length + ' transaksi</span></div>' +
    '<div class="card sum rest"><span class="lbl">Sisa bulan ini</span><strong>' + rupiah(s.rest) + '</strong>' +
    '<span class="note">Tabungan ' + rupiah(s.saving) + ' · bebas ' + rupiah(s.free) + '</span></div>' +
    '<div class="card sum rate"><span class="lbl">Tingkat tabungan</span><strong>' + persen(s.savingsRate) + '</strong>' +
    '<span class="note">dari pemasukan disisihkan · target 30%</span></div>' +
    '</section>' +
    '<div class="grid2">' +
    '<section class="card"><h2>Ke mana uang pergi</h2>' +
    '<canvas id="chart-donut" height="240" aria-label="Grafik donat pangsa pengeluaran per kategori"></canvas>' +
    '<ol class="toplist">' +
    top3.map((r, i) =>
      '<li><span><strong>' + (i + 1) + '.</strong> ' + esc(r.name) + '</span><strong>' +
      rupiah(r.used) + ' · ' + persen(r.used / Math.max(1, s.expense)) + '</strong></li>'
    ).join('') +
    '</ol><p class="more"><a href="#/laporan">Laporan lengkap →</a></p></section>' +
    '<section class="card"><h2>' + monthShort(prevMonth(currentMonth) || currentMonth) + ' vs ' +
    monthShort(currentMonth) + '</h2>' +
    '<canvas id="chart-compare" height="300" aria-label="Grafik batang perbandingan pengeluaran dua bulan"></canvas>' +
    '<p class="hint">Abu-abu = bulan lalu, warna = bulan ini. ' +
    (near.length ? near.map((r) => esc(r.name)).join(', ') + ' hampir menyentuh pagu.' : 'Semua kategori masih dalam pagu.') +
    '</p></section>' +
    '</div>' +
    '<div class="grid2">' +
    '<section class="card"><h2>Wawasan bulan ini</h2><ul class="insights">' +
    insights.slice(0, 4).map((w) =>
      '<li class="' + w.tone + '">' + esc(w.text) + '</li>'
    ).join('') +
    '</ul><p class="more"><a href="#/laporan">Semua wawasan di Laporan →</a></p></section>' +
    '<section class="card"><h2>Anggaran bulan ini</h2>' +
    rows.slice(0, 5).map(budgetRowLink).join('') +
    '<p class="more"><a href="#/anggaran">Lihat semua anggaran &amp; ubah pagu →</a></p></section>' +
    '</div>' +
    '<div class="grid2">' +
    '<section class="card"><h2>Tujuan tabungan</h2>' +
    goals.slice(0, 2).map((g) =>
      '<div class="goal-mini"><div><strong>' + esc(g.name) + '</strong><span>' + rupiah(g.saved) +
      ' dari ' + rupiah(g.target) + '</span></div>' + progressBar(g.ratio, '#0e5e3f') +
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
  const s = monthSummary(currentMonth, state);
  const donut = document.getElementById('chart-donut');
  if (donut) drawDonut(donut, rows, s.expense, s.income);
  const cmp = compareRows(currentMonth, state);
  const compare = document.getElementById('chart-compare');
  if (compare && cmp) {
    drawCompareBars(
      compare,
      cmp.rows.sort((a, b) => b.used - a.used),
      monthLabel(cmp.prev),
      monthLabel(currentMonth),
    );
  }
}

// ---------------- Anggaran ----------------

export function viewBudget(state) {
  const rows = categoryRows(currentMonth, state);
  const totals = budgetTotals(currentMonth, state);
  const over = rows.filter((r) => r.status === 'lewat').length;
  return (
    '<section class="hero"><div><p class="eyebrow">Pagu bulanan</p>' +
    '<h1>Anggaran ' + monthLabel(currentMonth) + '</h1>' +
    '<p class="sub">Total pagu ' + rupiah(totals.budget) + ' · terpakai ' + rupiah(totals.used) +
    ' · sisa pagu ' + rupiah(totals.budget - totals.used) +
    (over ? ' · ' + over + ' kategori melewati pagu.' : ' · semua kategori masih dalam pagu.') +
    ' Ubah pagu lalu tekan Simpan.</p></div>' +
    monthNav() + '</section>' +
    '<section class="card"><table class="budget"><thead><tr><th>Kategori</th><th>Status</th><th>Pagu (Rp)</th>' +
    '<th class="num">Terpakai</th><th class="num">Sisa</th><th style="width:24%">Progres</th><th></th></tr></thead><tbody>' +
    rows.map((r) =>
      '<tr><td><a class="catlink" href="#/kategori/' + r.id + '">' + chip(r) + ' ' + esc(r.name) + '</a></td>' +
      '<td>' + statusBadge(r.status) + '</td>' +
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
  const s = monthSummary(currentMonth, state);
  return (
    '<section class="hero"><div><p class="eyebrow">Catat setiap rupiah</p><h1>Transaksi ' + monthLabel(currentMonth) + '</h1>' +
    '<p class="sub">' + all.length + ' transaksi · pemasukan ' + rupiah(s.income) +
    ' · pengeluaran ' + rupiah(s.expense) + '</p></div>' +
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

// ---------------- Daftar kategori ----------------

export function viewCategories(state) {
  const rows = categoryRows(currentMonth, state).sort((a, b) => b.used - a.used);
  return (
    '<section class="hero"><div><p class="eyebrow">Delapan pos belanja</p><h1>Kategori ' + monthLabel(currentMonth) + '</h1>' +
    '<p class="sub">Setiap rupiah pengeluaran masuk ke satu kategori. Klik kartu untuk melihat rincian dan transaksinya.</p></div>' +
    monthNav() + '</section>' +
    '<div class="catgrid">' +
    rows.map((r) => {
      const count = transactionsFor(currentMonth, state).filter((t) => t.cat === r.id).length;
      return '<a class="card catcard" href="#/kategori/' + r.id + '">' + chip(r) +
        '<div class="catcard-top"><strong>' + esc(r.name) + '</strong>' + statusBadge(r.status) + '</div>' +
        '<div class="catcard-nums"><strong>' + rupiah(r.used) + '</strong><span>dari pagu ' + rupiah(r.budget) + '</span></div>' +
        progressBar(r.ratio, r.color) +
        '<p class="catcard-meta">' + persen(r.ratio) + ' terpakai · ' + count + ' transaksi · sisa ' + rupiah(r.left) + '</p></a>';
    }).join('') +
    '</div>'
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
  const deltaRatio = prevUsed > 0 ? delta / prevUsed : 0;
  return (
    '<section class="hero"><div><p class="eyebrow">Kategori</p><h1>' + chip(cat) + ' ' + esc(cat.name) + '</h1>' +
    '<p class="sub">' + monthLabel(currentMonth) + ' · pagu ' + rupiah(row.budget) + ' · ' + txs.length + ' transaksi</p></div>' +
    monthNav() + '</section>' +
    '<section class="cards">' +
    '<div class="card sum"><span class="lbl">Pagu</span><strong>' + rupiah(row.budget) + '</strong></div>' +
    '<div class="card sum out"><span class="lbl">Terpakai</span><strong>' + rupiah(row.used) + '</strong>' +
    '<span class="note">' + persen(row.ratio) + ' dari pagu</span></div>' +
    '<div class="card sum rest"><span class="lbl">Sisa pagu</span><strong>' + rupiah(row.left) + '</strong>' +
    '<span class="note">' + (prev ? 'Bulan lalu ' + rupiah(prevUsed) + ' (' + deltaPersen(deltaRatio) +
    ', ' + deltaRupiah(delta) + ')' : '') + '</span></div>' +
    '</section>' +
    '<section class="card"><h2>Progres pagu ' + statusBadge(row.status) + '</h2>' + progressBar(row.ratio, cat.color) +
    '<p class="hint">' + (row.status === 'lewat'
      ? 'Pagu terlampaui ' + rupiah(-row.left) + ' — kurangi belanja kategori ini sampai akhir bulan.'
      : row.status === 'hati-hati'
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
    '<section class="hero"><div><p class="eyebrow">Menabung dengan target</p><h1>Tujuan Tabungan</h1>' +
    '<p class="sub">Terkumpul ' + rupiah(totalSaved) + ' dari total target ' + rupiah(totalTarget) +
    ' (' + persen(totalSaved / Math.max(1, totalTarget)) + ') · disisihkan ' + rupiah(SAVINGS_TARGET) + ' setiap bulan.</p></div></section>' +
    '<div class="goals">' +
    goals.map((g) =>
      '<section class="card goal"><h2>' + esc(g.name) + '</h2>' +
      '<p class="sub">' + esc(g.note) + '</p>' +
      '<div class="goal-nums"><strong>' + rupiah(g.saved) + '</strong><span>dari ' + rupiah(g.target) + '</span></div>' +
      progressBar(g.ratio, '#0e5e3f') +
      '<p class="goal-left">' + persen(g.ratio) + ' tercapai · kurang ' + rupiah(g.left) + '</p>' +
      '<form class="goal-form" data-goal="' + g.id + '">' +
      '<label>Tambah dana (Rp)<input type="number" name="amount" min="1000" step="1000" placeholder="100000" required></label>' +
      '<button class="btn small" type="submit">Tambah</button></form></section>'
    ).join('') +
    '</div>' +
    '<section class="card"><h2>Cara keluarga menabung</h2><ol class="tips">' +
    '<li>Setiap tanggal 1, begitu gaji masuk, ' + rupiah(SAVINGS_TARGET) + ' langsung dipindah ke rekening tabungan sebelum belanja.</li>' +
    '<li>Dana darurat didahulukan sampai penuh, baru kelebihan dialihkan ke liburan dan renovasi dapur.</li>' +
    '<li>Sisa pagu kategori di akhir bulan ikut masuk ke dana darurat — bulan ini belanja harian masih menyisakan pagu ' +
    rupiah((categoryRows(currentMonth, state).find((r) => r.id === 'belanja') || { left: 0 }).left) + '.</li>' +
    '</ol></section>'
  );
}

// ---------------- Laporan ----------------

export function viewReport(state) {
  const rows = categoryRows(currentMonth, state).sort((a, b) => b.used - a.used);
  const cmp = compareRows(currentMonth, state);
  const prev = cmp ? cmp.prev : null;
  const prevUsed = (id) => (cmp ? (cmp.rows.find((r) => r.id === id) || { old: 0 }).old : 0);
  const s = monthSummary(currentMonth, state);
  const prevS = prev ? monthSummary(prev, state) : null;
  const top = topExpenses(currentMonth, state, 5);
  const insights = buildInsights(currentMonth, state);
  return (
    '<section class="hero"><div><p class="eyebrow">Evaluasi bulanan</p><h1>Laporan ' + monthLabel(currentMonth) + '</h1>' +
    '<p class="sub">Bandingkan dengan ' + (prev ? monthLabel(prev) : '—') + ' dan lihat ke mana uang keluarga pergi.</p></div>' +
    monthNav() + '</section>' +
    '<div class="grid2">' +
    '<section class="card"><h2>Pangsa pengeluaran</h2>' +
    '<canvas id="chart-donut" height="240" aria-label="Grafik donat pangsa pengeluaran per kategori"></canvas></section>' +
    '<section class="card"><h2>Pengeluaran terbesar bulan ini</h2><ol class="toplist">' +
    top.map((t) => '<li><span>' + esc(t.desc) + ' <em>' + tanggalSingkat(t.date) + '</em></span><strong>' + rupiah(t.amount) + '</strong></li>').join('') +
    '</ol><p class="hint">Tiga besar adalah kewajiban tetap: SPP anak, belanja mingguan, dan listrik.</p></section>' +
    '</div>' +
    '<section class="card"><h2>Perbandingan per kategori — ' + (prev ? monthLabel(prev) : '') + ' vs ' + monthLabel(currentMonth) + '</h2>' +
    '<canvas id="chart-compare" height="300" aria-label="Grafik batang perbandingan pengeluaran dua bulan"></canvas>' +
    '<table class="cmp"><thead><tr><th>Kategori</th><th class="num">' + (prev ? monthLabel(prev) : '') +
    '</th><th class="num">' + monthLabel(currentMonth) + '</th><th class="num">Selisih</th></tr></thead><tbody>' +
    rows.map((r) => {
      const d = r.used - prevUsed(r.id);
      return '<tr><td><a class="catlink" href="#/kategori/' + r.id + '">' + chip(r) + ' ' + esc(r.name) +
        '</a></td><td class="num">' + rupiah(prevUsed(r.id)) + '</td><td class="num">' + rupiah(r.used) +
        '</td><td class="num ' + (d > 0 ? 'over-txt' : 'good-txt') + '">' + deltaRupiah(d) + '</td></tr>';
    }).join('') +
    '<tr class="total"><td><strong>Total pengeluaran</strong></td><td class="num"><strong>' +
    (prevS ? rupiah(prevS.expense) : '—') + '</strong></td><td class="num"><strong>' + rupiah(s.expense) +
    '</strong></td><td class="num"><strong>' + (prevS ? deltaRupiah(s.expense - prevS.expense) : '—') + '</strong></td></tr>' +
    '</tbody></table></section>' +
    '<section class="card"><h2>Wawasan bulan ini</h2><ul class="insights">' +
    insights.map((w) => '<li class="' + w.tone + '">' + esc(w.text) + '</li>').join('') +
    '</ul></section>'
  );
}

export function afterReport(state) {
  const rows = categoryRows(currentMonth, state).sort((a, b) => b.used - a.used);
  const s = monthSummary(currentMonth, state);
  const donut = document.getElementById('chart-donut');
  if (donut) drawDonut(donut, rows, s.expense, s.income);
  const cmp = compareRows(currentMonth, state);
  const compare = document.getElementById('chart-compare');
  if (compare && cmp) {
    drawCompareBars(
      compare,
      cmp.rows.sort((a, b) => b.used - a.used),
      monthLabel(cmp.prev),
      monthLabel(currentMonth),
    );
  }
}
