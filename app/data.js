// DompetKita v2 — data benih Keluarga Hartono (Jakarta), fiktif.
// Bulan berjalan: November 2026. Oktober 2026 dipakai sebagai pembanding.
// Semua jumlah per kategori sama dengan jumlah transaksinya (diuji di Node).

export const FAMILY = {
  name: 'Keluarga Hartono',
  city: 'Jakarta',
  members: ['Budi', 'Sari', 'Nara'],
  currency: 'IDR',
};

export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Harian', color: '#0e5e3f', budget: 4500000 },
  { id: 'makan', name: 'Makan di Luar', color: '#e9a13b', budget: 1500000 },
  { id: 'transport', name: 'Transportasi', color: '#3e7cb1', budget: 1800000 },
  { id: 'tagihan', name: 'Tagihan & Utilitas', color: '#6d597a', budget: 3200000 },
  { id: 'pendidikan', name: 'Pendidikan Anak', color: '#2a9d8f', budget: 2600000 },
  { id: 'kesehatan', name: 'Kesehatan', color: '#e76f51', budget: 900000 },
  { id: 'hiburan', name: 'Hiburan', color: '#c0392b', budget: 800000 },
  { id: 'lain', name: 'Lain-lain', color: '#8a8f98', budget: 800000 },
];

export const MONTHS = [
  { id: '2026-10', label: 'Oktober 2026', short: 'Okt' },
  { id: '2026-11', label: 'November 2026', short: 'Nov' },
];

export const CURRENT_MONTH = '2026-11';

// Pemasukan: { id, month, date, source, amount }
// Gaji Budi 18.500.000 + gaji Sari 6.000.000 setiap bulan; jualan online Sari
// 900.000 di Okt, 1.250.000 di Nov.
export const INCOME = [
  { id: 'i-okt-1', month: '2026-10', date: '2026-10-01', source: 'Gaji Budi', amount: 18500000 },
  { id: 'i-okt-2', month: '2026-10', date: '2026-10-01', source: 'Gaji Sari', amount: 6000000 },
  { id: 'i-okt-3', month: '2026-10', date: '2026-10-18', source: 'Jualan online Sari', amount: 900000 },
  { id: 'i-nov-1', month: '2026-11', date: '2026-11-01', source: 'Gaji Budi', amount: 18500000 },
  { id: 'i-nov-2', month: '2026-11', date: '2026-11-01', source: 'Gaji Sari', amount: 6000000 },
  { id: 'i-nov-3', month: '2026-11', date: '2026-11-20', source: 'Jualan online Sari', amount: 1250000 },
];

// Pengeluaran November 2026 — total Rp 14.560.000 (35 transaksi).
export const EXPENSES_NOV = [
  // Belanja Harian — 4.120.000
  { id: 'n01', date: '2026-11-02', cat: 'belanja', desc: 'Pasar Minggu', amount: 385000 },
  { id: 'n02', date: '2026-11-05', cat: 'belanja', desc: 'Super Indo', amount: 742000 },
  { id: 'n03', date: '2026-11-09', cat: 'belanja', desc: 'Pasar Minggu', amount: 410000 },
  { id: 'n04', date: '2026-11-14', cat: 'belanja', desc: 'Super Indo', amount: 918000 },
  { id: 'n05', date: '2026-11-19', cat: 'belanja', desc: 'Sayur & buah pasar', amount: 365000 },
  { id: 'n06', date: '2026-11-23', cat: 'belanja', desc: 'Super Indo', amount: 1300000 },
  // Makan di Luar — 1.640.000
  { id: 'n07', date: '2026-11-03', cat: 'makan', desc: 'Warteg Bahari', amount: 86000 },
  { id: 'n08', date: '2026-11-07', cat: 'makan', desc: 'Kopi & roti', amount: 145000 },
  { id: 'n09', date: '2026-11-12', cat: 'makan', desc: 'Resto keluarga', amount: 620000 },
  { id: 'n10', date: '2026-11-16', cat: 'makan', desc: 'GoFood ayam geprek', amount: 98000 },
  { id: 'n11', date: '2026-11-21', cat: 'makan', desc: 'Makan malam di mal', amount: 420000 },
  { id: 'n12', date: '2026-11-25', cat: 'makan', desc: 'Kopi Kenangan', amount: 271000 },
  // Transportasi — 1.455.000
  { id: 'n13', date: '2026-11-01', cat: 'transport', desc: 'Bensin Pertamax', amount: 350000 },
  { id: 'n14', date: '2026-11-06', cat: 'transport', desc: 'Parkir & tol', amount: 185000 },
  { id: 'n15', date: '2026-11-10', cat: 'transport', desc: 'Bensin', amount: 320000 },
  { id: 'n16', date: '2026-11-15', cat: 'transport', desc: 'Ojek online', amount: 210000 },
  { id: 'n17', date: '2026-11-20', cat: 'transport', desc: 'Bensin', amount: 390000 },
  // Tagihan & Utilitas — 3.050.000
  { id: 'n18', date: '2026-11-01', cat: 'tagihan', desc: 'Listrik PLN', amount: 980000 },
  { id: 'n19', date: '2026-11-03', cat: 'tagihan', desc: 'Air PDAM', amount: 320000 },
  { id: 'n20', date: '2026-11-05', cat: 'tagihan', desc: 'Internet & TV kabel', amount: 520000 },
  { id: 'n21', date: '2026-11-08', cat: 'tagihan', desc: 'Iuran RT & keamanan', amount: 180000 },
  { id: 'n22', date: '2026-11-11', cat: 'tagihan', desc: 'Pulsa & paket data', amount: 350000 },
  { id: 'n23', date: '2026-11-14', cat: 'tagihan', desc: 'Gas & galon', amount: 240000 },
  { id: 'n24', date: '2026-11-18', cat: 'tagihan', desc: 'Service AC', amount: 460000 },
  // Pendidikan Anak — 2.600.000
  { id: 'n25', date: '2026-11-02', cat: 'pendidikan', desc: 'SPP Nara', amount: 1500000 },
  { id: 'n26', date: '2026-11-06', cat: 'pendidikan', desc: 'Les matematika', amount: 750000 },
  { id: 'n27', date: '2026-11-14', cat: 'pendidikan', desc: 'Buku & alat tulis', amount: 350000 },
  // Kesehatan — 420.000
  { id: 'n28', date: '2026-11-09', cat: 'kesehatan', desc: 'Apotek vitamin', amount: 185000 },
  { id: 'n29', date: '2026-11-17', cat: 'kesehatan', desc: 'Periksa gigi Nara', amount: 235000 },
  // Hiburan — 965.000
  { id: 'n30', date: '2026-11-08', cat: 'hiburan', desc: 'Bioskop keluarga', amount: 310000 },
  { id: 'n31', date: '2026-11-13', cat: 'hiburan', desc: 'Langganan streaming', amount: 149000 },
  { id: 'n32', date: '2026-11-15', cat: 'hiburan', desc: 'Mainan Nara', amount: 356000 },
  { id: 'n33', date: '2026-11-22', cat: 'hiburan', desc: 'Tiket taman bermain', amount: 150000 },
  // Lain-lain — 310.000
  { id: 'n34', date: '2026-11-11', cat: 'lain', desc: 'Kado ulang tahun', amount: 210000 },
  { id: 'n35', date: '2026-11-24', cat: 'lain', desc: 'Fotokopi & materai', amount: 100000 },
];

// Pengeluaran Oktober 2026 — total Rp 13.855.000 (30 transaksi).
export const EXPENSES_OCT = [
  // Belanja Harian — 3.980.000
  { id: 'o01', date: '2026-10-03', cat: 'belanja', desc: 'Pasar Minggu', amount: 420000 },
  { id: 'o02', date: '2026-10-07', cat: 'belanja', desc: 'Super Indo', amount: 680000 },
  { id: 'o03', date: '2026-10-12', cat: 'belanja', desc: 'Pasar Minggu', amount: 390000 },
  { id: 'o04', date: '2026-10-17', cat: 'belanja', desc: 'Super Indo', amount: 890000 },
  { id: 'o05', date: '2026-10-24', cat: 'belanja', desc: 'Super Indo', amount: 1600000 },
  // Makan di Luar — 1.320.000
  { id: 'o06', date: '2026-10-04', cat: 'makan', desc: 'Warteg Bahari', amount: 120000 },
  { id: 'o07', date: '2026-10-10', cat: 'makan', desc: 'Kopi & roti', amount: 95000 },
  { id: 'o08', date: '2026-10-15', cat: 'makan', desc: 'Resto keluarga', amount: 480000 },
  { id: 'o09', date: '2026-10-21', cat: 'makan', desc: 'Makan malam di mal', amount: 625000 },
  // Transportasi — 1.380.000
  { id: 'o10', date: '2026-10-02', cat: 'transport', desc: 'Bensin', amount: 330000 },
  { id: 'o11', date: '2026-10-08', cat: 'transport', desc: 'Parkir & tol', amount: 170000 },
  { id: 'o12', date: '2026-10-13', cat: 'transport', desc: 'Bensin', amount: 300000 },
  { id: 'o13', date: '2026-10-19', cat: 'transport', desc: 'Ojek online', amount: 580000 },
  // Tagihan & Utilitas — 2.980.000
  { id: 'o14', date: '2026-10-01', cat: 'tagihan', desc: 'Listrik PLN', amount: 1150000 },
  { id: 'o15', date: '2026-10-03', cat: 'tagihan', desc: 'Air PDAM', amount: 310000 },
  { id: 'o16', date: '2026-10-05', cat: 'tagihan', desc: 'Internet & TV kabel', amount: 520000 },
  { id: 'o17', date: '2026-10-08', cat: 'tagihan', desc: 'Iuran RT & keamanan', amount: 180000 },
  { id: 'o18', date: '2026-10-11', cat: 'tagihan', desc: 'Pulsa & paket data', amount: 320000 },
  { id: 'o19', date: '2026-10-14', cat: 'tagihan', desc: 'Gas & galon', amount: 240000 },
  { id: 'o20', date: '2026-10-18', cat: 'tagihan', desc: 'Service AC', amount: 260000 },
  // Pendidikan Anak — 2.600.000
  { id: 'o21', date: '2026-10-02', cat: 'pendidikan', desc: 'SPP Nara', amount: 1500000 },
  { id: 'o22', date: '2026-10-06', cat: 'pendidikan', desc: 'Les matematika', amount: 750000 },
  { id: 'o23', date: '2026-10-14', cat: 'pendidikan', desc: 'Buku & alat tulis', amount: 350000 },
  // Kesehatan — 610.000
  { id: 'o24', date: '2026-10-09', cat: 'kesehatan', desc: 'Apotek vitamin', amount: 260000 },
  { id: 'o25', date: '2026-10-17', cat: 'kesehatan', desc: 'Dokter umum', amount: 350000 },
  // Hiburan — 720.000
  { id: 'o26', date: '2026-10-08', cat: 'hiburan', desc: 'Bioskop keluarga', amount: 280000 },
  { id: 'o27', date: '2026-10-13', cat: 'hiburan', desc: 'Langganan streaming', amount: 149000 },
  { id: 'o28', date: '2026-10-15', cat: 'hiburan', desc: 'Mainan Nara', amount: 291000 },
  // Lain-lain — 265.000
  { id: 'o29', date: '2026-10-11', cat: 'lain', desc: 'Kado ulang tahun', amount: 165000 },
  { id: 'o30', date: '2026-10-24', cat: 'lain', desc: 'Fotokopi & materai', amount: 100000 },
];

// Tujuan tabungan. "saved" adalah saldo per 27 Nov 2026.
export const GOALS = [
  { id: 'g-darurat', name: 'Dana Darurat', note: 'Enam bulan biaya hidup, disimpan terpisah.', target: 20000000, saved: 12400000 },
  { id: 'g-liburan', name: 'Liburan Keluarga', note: 'Tiga hari di Bandung saat libur sekolah.', target: 8000000, saved: 5150000 },
  { id: 'g-laptop', name: 'Laptop Nara', note: 'Untuk belajar dan tugas sekolah.', target: 6500000, saved: 2500000 },
  { id: 'g-dapur', name: 'Renovasi Dapur', note: 'Ganti kabinet dan kompor, dicicil bertahap.', target: 15000000, saved: 3750000 },
];

// Target tabungan bulanan keluarga (dipakai Dasbor: sisa setelah tabungan).
export const SAVINGS_TARGET = 4000000;
