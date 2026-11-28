// Wawasan otomatis dari angka nyata: peringatan pagu, perbandingan bulan,
// arah tiga bulan, dan tagihan yang belum lunas. Semua teks dihitung dari
// state — bukan kalimat tempelan — supaya selalu cocok dengan angka di layar.

import { deltaPersen, deltaRupiah, persen, rupiah } from './format.js';
import {
  billRows,
  billTotals,
  categoryRows,
  compareRows,
  monthSummary,
  topExpenses,
  trendRows,
} from './store.js';

// Kategori yang melewati pagu bulan ini (untuk strip peringatan Dasbor).
export function budgetAlerts(month, state) {
  return categoryRows(month, state).filter((r) => r.status === 'lewat');
}

// Kategori yang hampir habis (85–100% pagu).
export function nearBudget(month, state) {
  return categoryRows(month, state).filter((r) => r.status === 'hati-hati');
}

// Daftar wawasan, masing-masing { tone: 'warn' | 'good' | 'info', text }.
// Urutan: peringatan dulu, lalu kabar baik, lalu info.
export function buildInsights(month, state) {
  const out = [];
  const s = monthSummary(month, state);
  const cmp = compareRows(month, state);
  const rows = categoryRows(month, state).sort((a, b) => b.used - a.used);

  // 1. Kategori melewati pagu.
  rows.filter((r) => r.status === 'lewat').forEach((r) => {
    out.push({
      tone: 'warn',
      text: r.name + ' melewati pagu ' + rupiah(r.budget) + ' sebesar ' + rupiah(-r.left) +
        ' (' + persen(r.ratio) + '). Kurangi belanja kategori ini sampai akhir bulan.',
    });
  });

  // 2. Kenaikan terbesar vs bulan lalu (hanya bila naik >= 10%).
  if (cmp) {
    const risers = cmp.rows
      .filter((r) => r.old > 0 && r.deltaRatio >= 0.1)
      .sort((a, b) => b.deltaRatio - a.deltaRatio);
    if (risers.length) {
      const r = risers[0];
      out.push({
        tone: 'warn',
        text: r.name + ' naik ' + deltaPersen(r.deltaRatio) + ' dibanding bulan lalu (' +
          deltaRupiah(r.delta) + '). Kenaikan terbesar bulan ini.',
      });
    }
    // 3. Penurunan terbesar vs bulan lalu (kabar baik, turun >= 10%).
    const fallers = cmp.rows
      .filter((r) => r.old > 0 && r.deltaRatio <= -0.1)
      .sort((a, b) => a.deltaRatio - b.deltaRatio);
    if (fallers.length) {
      const r = fallers[0];
      out.push({
        tone: 'good',
        text: r.name + ' turun ' + deltaPersen(r.deltaRatio) + ' dibanding bulan lalu (' +
          deltaRupiah(r.delta) + '). Penghematan terbesar bulan ini.',
      });
    }
    // 4. Total pengeluaran bulan ini vs bulan lalu.
    const prevExpense = cmp.rows.reduce((t, r) => t + r.old, 0);
    const d = s.expense - prevExpense;
    out.push({
      tone: d > 0 ? 'warn' : 'good',
      text: 'Total pengeluaran ' + (d > 0 ? 'naik ' : 'turun ') + rupiah(Math.abs(d)) +
        ' dibanding bulan lalu (' + rupiah(prevExpense) + ' menjadi ' + rupiah(s.expense) + ').',
    });
  }

  // 5. Arah tiga bulan: total pengeluaran Sep → Okt → Nov.
  const trend = trendRows(state);
  if (trend.length >= 3) {
    const [a, b, c] = trend;
    const d1 = b.expense - a.expense;
    const d2 = c.expense - b.expense;
    const dir = (x) => (x > 0 ? 'naik ' : x < 0 ? 'turun ' : 'tetap ');
    out.push({
      tone: d2 <= 0 ? 'good' : 'info',
      text: 'Tiga bulan terakhir: ' + a.short + ' ' + rupiah(a.expense) + ', ' + b.short + ' ' +
        dir(d1) + rupiah(Math.abs(d1)) + ', ' + c.short + ' ' + dir(d2) + rupiah(Math.abs(d2)) +
        '. Pengeluaran ' + (d2 > 0 ? 'masih naik' : d2 < 0 ? 'mulai turun' : 'stabil') + '.',
    });
  }

  // 6. Tagihan tetap yang belum lunas bulan ini.
  const bills = billRows(state);
  const bt = billTotals(bills);
  if (bt.paidCount < bt.count) {
    const unpaid = bills.filter((b) => !b.paid).map((b) => b.name).join(' dan ');
    out.push({
      tone: 'warn',
      text: unpaid + ' belum lunas — ' + rupiah(bt.unpaidSum) + ' dari ' + rupiah(bt.total) +
        ' tagihan tetap bulan ini. Cek halaman Tagihan.',
    });
  } else {
    out.push({
      tone: 'good',
      text: 'Semua ' + bt.count + ' tagihan tetap bulan ini sudah lunas (' + rupiah(bt.total) + ').',
    });
  }

  // 7. Tingkat tabungan.
  out.push({
    tone: s.savingsRate >= 0.3 ? 'good' : 'info',
    text: 'Sisa bulan ini ' + rupiah(s.rest) + ' — ' + persen(s.savingsRate) +
      ' dari pemasukan. Target tabungan ' + rupiah(s.saving) + ' tercapai, bebas dipakai ' +
      rupiah(s.free) + '.',
  });

  // 8. Pengeluaran terbesar bulan ini.
  const top = topExpenses(month, state, 1)[0];
  if (top) {
    const cat = rows.find((r) => r.id === top.cat);
    out.push({
      tone: 'info',
      text: 'Pengeluaran terbesar bulan ini: ' + top.desc + ' (' + rupiah(top.amount) + ')' +
        (cat ? ' — kategori ' + cat.name + '.' : '.'),
    });
  }

  // 9. Kategori terbesar pangsanya.
  const biggest = rows[0];
  if (biggest) {
    out.push({
      tone: 'info',
      text: biggest.name + ' adalah pos terbesar: ' + rupiah(biggest.used) + ' atau ' +
        persen(biggest.used / Math.max(1, s.expense)) + ' dari seluruh pengeluaran.',
    });
  }

  return out;
}
