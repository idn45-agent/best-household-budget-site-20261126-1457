// Wawasan otomatis dari angka nyata: peringatan pagu, perbandingan bulan,
// dan hal yang patut dirayakan. Semua teks dihitung dari state — bukan
// kalimat tempelan — supaya selalu cocok dengan angka di layar.

import { deltaPersen, deltaRupiah, persen, rupiah } from './format.js';
import {
  categoryRows,
  compareRows,
  monthSummary,
  topExpenses,
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

  // 5. Tingkat tabungan.
  out.push({
    tone: s.savingsRate >= 0.3 ? 'good' : 'info',
    text: 'Sisa bulan ini ' + rupiah(s.rest) + ' — ' + persen(s.savingsRate) +
      ' dari pemasukan. Target tabungan ' + rupiah(s.saving) + ' tercapai, bebas dipakai ' +
      rupiah(s.free) + '.',
  });

  // 6. Pengeluaran terbesar bulan ini.
  const top = topExpenses(month, state, 1)[0];
  if (top) {
    const cat = rows.find((r) => r.id === top.cat);
    out.push({
      tone: 'info',
      text: 'Pengeluaran terbesar bulan ini: ' + top.desc + ' (' + rupiah(top.amount) + ')' +
        (cat ? ' — kategori ' + cat.name + '.' : '.'),
    });
  }

  // 7. Kategori terbesar pangsanya.
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
