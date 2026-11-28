// Tagihan tetap v3 — tampilan dan logika halaman #/tagihan.
// Daftar dan jumlah berasal dari store.js (satu sumber kebenaran); file ini
// menambah label status, tagihan belum lunas berikutnya, dan ringkasan teks.

import { billRows, billTotals } from './store.js';

export function statusLabel(row) {
  return row.paid ? 'Lunas' : 'Belum lunas';
}

export function dueLabel(row) {
  return 'Jatuh tempo tgl ' + row.due;
}

// Tagihan yang belum lunas, jatuh tempo paling dekat dulu.
export function unpaidRows(state) {
  return billRows(state).filter((r) => !r.paid);
}

export function nextDue(state) {
  const unpaid = unpaidRows(state);
  return unpaid.length ? unpaid[0] : null;
}

// Satu kalimat ringkasan untuk strip atas halaman Tagihan.
export function billsSummaryText(state) {
  const rows = billRows(state);
  const t = billTotals(rows);
  if (t.paidCount === t.count) {
    return 'Semua ' + t.count + ' tagihan tetap bulan ini sudah lunas (' +
      'Rp' + t.total.toLocaleString('id-ID') + ').';
  }
  return t.paidCount + ' dari ' + t.count + ' tagihan sudah lunas (' +
    'Rp' + t.paidSum.toLocaleString('id-ID') + '). Masih ada ' + (t.count - t.paidCount) +
    ' tagihan belum lunas senilai Rp' + t.unpaidSum.toLocaleString('id-ID') + '.';
}
