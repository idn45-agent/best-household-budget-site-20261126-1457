// DompetKita v3 — data benih Keluarga Santoso (Yogyakarta), fiktif.
// Bulan berjalan: November 2026 (data sampai 27 November). September dan
// Oktober 2026 dipakai sebagai pembanding (tren tiga bulan).
// Semua jumlah per kategori sama dengan jumlah transaksinya (diuji di Node).

export const FAMILY = {
  name: 'Keluarga Santoso',
  city: 'Yogyakarta',
  members: ['Andi', 'Maya', 'Dimas'],
  currency: 'IDR',
};

export const CATEGORIES = [
  { id: 'belanja', name: 'Belanja Pasar', color: '#b45309', budget: 3800000 },
  { id: 'makan', name: 'Jajan & Makan Luar', color: '#dc2626', budget: 1200000 },
  { id: 'transport', name: 'Bensin & Transport', color: '#1d4ed8', budget: 1600000 },
  { id: 'tagihan', name: 'Listrik, Air & Internet', color: '#0f766e', budget: 2900000 },
  { id: 'sekolah', name: 'Sekolah Dimas', color: '#6d28d9', budget: 2300000 },
  { id: 'kesehatan', name: 'Kesehatan', color: '#be185d', budget: 750000 },
  { id: 'hiburan', name: 'Hiburan & Rekreasi', color: '#4d7c0f', budget: 650000 },
  { id: 'sosial', name: 'Arisan & Sosial', color: '#92400e', budget: 900000 },
];

export const MONTHS = [
  { id: '2026-09', label: 'September 2026', short: 'Sep' },
  { id: '2026-10', label: 'Oktober 2026', short: 'Okt' },
  { id: '2026-11', label: 'November 2026', short: 'Nov' },
];

export const CURRENT_MONTH = '2026-11';

// Hari terakhir data: 27 November 2026. November 30 hari, jadi tersisa 3 hari.
export const DATA_THROUGH = '27 November 2026';
export const DAYS_LEFT_IN_MONTH = 3;

// Pemasukan: { id, month, date, source, amount }
// Gaji Andi 14.800.000 + gaji Maya 7.200.000 setiap bulan; katering Maya
// 1.100.000 di Sep, 1.400.000 di Okt, 1.850.000 di Nov.
export const INCOME = [
  { id: 'i-sep-1', month: '2026-09', date: '2026-09-01', source: 'Gaji Andi', amount: 14800000 },
  { id: 'i-sep-2', month: '2026-09', date: '2026-09-01', source: 'Gaji Maya', amount: 7200000 },
  { id: 'i-sep-3', month: '2026-09', date: '2026-09-20', source: 'Katering Maya', amount: 1100000 },
  { id: 'i-okt-1', month: '2026-10', date: '2026-10-01', source: 'Gaji Andi', amount: 14800000 },
  { id: 'i-okt-2', month: '2026-10', date: '2026-10-01', source: 'Gaji Maya', amount: 7200000 },
  { id: 'i-okt-3', month: '2026-10', date: '2026-10-18', source: 'Katering Maya', amount: 1400000 },
  { id: 'i-nov-1', month: '2026-11', date: '2026-11-01', source: 'Gaji Andi', amount: 14800000 },
  { id: 'i-nov-2', month: '2026-11', date: '2026-11-01', source: 'Gaji Maya', amount: 7200000 },
  { id: 'i-nov-3', month: '2026-11', date: '2026-11-20', source: 'Katering Maya', amount: 1850000 },
];

// Pengeluaran November 2026 — total Rp 13.410.000 (36 transaksi).
export const EXPENSES_NOV = [
  // Belanja Pasar — 3.520.000
  { id: 'n01', date: '2026-11-02', cat: 'belanja', desc: 'Pasar Beringharjo', amount: 420000 },
  { id: 'n02', date: '2026-11-06', cat: 'belanja', desc: 'Super Indo', amount: 785000 },
  { id: 'n03', date: '2026-11-11', cat: 'belanja', desc: 'Pasar Beringharjo', amount: 395000 },
  { id: 'n04', date: '2026-11-16', cat: 'belanja', desc: 'Super Indo', amount: 920000 },
  { id: 'n05', date: '2026-11-21', cat: 'belanja', desc: 'Sayur & buah pasar', amount: 340000 },
  { id: 'n06', date: '2026-11-25', cat: 'belanja', desc: 'Super Indo', amount: 660000 },
  // Jajan & Makan Luar — 1.315.000
  { id: 'n07', date: '2026-11-03', cat: 'makan', desc: 'Angkringan', amount: 45000 },
  { id: 'n08', date: '2026-11-07', cat: 'makan', desc: 'Kopi & roti', amount: 120000 },
  { id: 'n09', date: '2026-11-12', cat: 'makan', desc: 'Resto keluarga', amount: 540000 },
  { id: 'n10', date: '2026-11-17', cat: 'makan', desc: 'GoFood sate', amount: 95000 },
  { id: 'n11', date: '2026-11-22', cat: 'makan', desc: 'Makan malam di mal', amount: 380000 },
  { id: 'n12', date: '2026-11-26', cat: 'makan', desc: 'Kopi Tuku', amount: 135000 },
  // Bensin & Transport — 1.480.000
  { id: 'n13', date: '2026-11-01', cat: 'transport', desc: 'Bensin Pertalite', amount: 300000 },
  { id: 'n14', date: '2026-11-05', cat: 'transport', desc: 'Parkir & tol', amount: 160000 },
  { id: 'n15', date: '2026-11-10', cat: 'transport', desc: 'Bensin', amount: 310000 },
  { id: 'n16', date: '2026-11-15', cat: 'transport', desc: 'Ojek online', amount: 240000 },
  { id: 'n17', date: '2026-11-20', cat: 'transport', desc: 'Bensin', amount: 320000 },
  { id: 'n18', date: '2026-11-26', cat: 'transport', desc: 'Parkir', amount: 150000 },
  // Listrik, Air & Internet — 2.860.000
  { id: 'n19', date: '2026-11-01', cat: 'tagihan', desc: 'Listrik PLN', amount: 980000 },
  { id: 'n20', date: '2026-11-03', cat: 'tagihan', desc: 'Air PDAM', amount: 285000 },
  { id: 'n21', date: '2026-11-05', cat: 'tagihan', desc: 'Internet & TV', amount: 520000 },
  { id: 'n22', date: '2026-11-08', cat: 'tagihan', desc: 'Iuran RT', amount: 150000 },
  { id: 'n23', date: '2026-11-11', cat: 'tagihan', desc: 'Pulsa & paket data', amount: 285000 },
  { id: 'n24', date: '2026-11-14', cat: 'tagihan', desc: 'Gas & galon', amount: 240000 },
  { id: 'n25', date: '2026-11-18', cat: 'tagihan', desc: 'Service AC', amount: 400000 },
  // Sekolah Dimas — 2.300.000
  { id: 'n26', date: '2026-11-02', cat: 'sekolah', desc: 'SPP Dimas', amount: 1400000 },
  { id: 'n27', date: '2026-11-06', cat: 'sekolah', desc: 'Les bahasa Inggris', amount: 600000 },
  { id: 'n28', date: '2026-11-14', cat: 'sekolah', desc: 'Buku & alat tulis', amount: 300000 },
  // Kesehatan — 380.000
  { id: 'n29', date: '2026-11-09', cat: 'kesehatan', desc: 'Apotek vitamin', amount: 150000 },
  { id: 'n30', date: '2026-11-17', cat: 'kesehatan', desc: 'Periksa mata Dimas', amount: 230000 },
  // Hiburan & Rekreasi — 715.000
  { id: 'n31', date: '2026-11-08', cat: 'hiburan', desc: 'Bioskop keluarga', amount: 280000 },
  { id: 'n32', date: '2026-11-13', cat: 'hiburan', desc: 'Mainan Dimas', amount: 285000 },
  { id: 'n33', date: '2026-11-22', cat: 'hiburan', desc: 'Taman bermain', amount: 150000 },
  // Arisan & Sosial — 840.000
  { id: 'n34', date: '2026-11-05', cat: 'sosial', desc: 'Arisan RT', amount: 500000 },
  { id: 'n35', date: '2026-11-11', cat: 'sosial', desc: 'Kado ulang tahun', amount: 190000 },
  { id: 'n36', date: '2026-11-24', cat: 'sosial', desc: 'Sumbangan masjid', amount: 150000 },
];

// Pengeluaran Oktober 2026 — total Rp 13.380.000 (31 transaksi).
export const EXPENSES_OCT = [
  // Belanja Pasar — 3.650.000
  { id: 'o01', date: '2026-10-03', cat: 'belanja', desc: 'Pasar Beringharjo', amount: 450000 },
  { id: 'o02', date: '2026-10-08', cat: 'belanja', desc: 'Super Indo', amount: 720000 },
  { id: 'o03', date: '2026-10-13', cat: 'belanja', desc: 'Pasar Beringharjo', amount: 380000 },
  { id: 'o04', date: '2026-10-18', cat: 'belanja', desc: 'Super Indo', amount: 940000 },
  { id: 'o05', date: '2026-10-24', cat: 'belanja', desc: 'Super Indo', amount: 1160000 },
  // Jajan & Makan Luar — 1.050.000
  { id: 'o06', date: '2026-10-04', cat: 'makan', desc: 'Angkringan', amount: 60000 },
  { id: 'o07', date: '2026-10-10', cat: 'makan', desc: 'Kopi & roti', amount: 110000 },
  { id: 'o08', date: '2026-10-15', cat: 'makan', desc: 'Resto keluarga', amount: 460000 },
  { id: 'o09', date: '2026-10-21', cat: 'makan', desc: 'Makan malam di mal', amount: 420000 },
  // Bensin & Transport — 1.520.000
  { id: 'o10', date: '2026-10-02', cat: 'transport', desc: 'Bensin', amount: 330000 },
  { id: 'o11', date: '2026-10-08', cat: 'transport', desc: 'Parkir & tol', amount: 170000 },
  { id: 'o12', date: '2026-10-13', cat: 'transport', desc: 'Bensin', amount: 300000 },
  { id: 'o13', date: '2026-10-19', cat: 'transport', desc: 'Ojek online', amount: 720000 },
  // Listrik, Air & Internet — 2.950.000
  { id: 'o14', date: '2026-10-01', cat: 'tagihan', desc: 'Listrik PLN', amount: 1050000 },
  { id: 'o15', date: '2026-10-03', cat: 'tagihan', desc: 'Air PDAM', amount: 290000 },
  { id: 'o16', date: '2026-10-05', cat: 'tagihan', desc: 'Internet & TV', amount: 520000 },
  { id: 'o17', date: '2026-10-08', cat: 'tagihan', desc: 'Iuran RT', amount: 150000 },
  { id: 'o18', date: '2026-10-11', cat: 'tagihan', desc: 'Pulsa & paket data', amount: 300000 },
  { id: 'o19', date: '2026-10-14', cat: 'tagihan', desc: 'Gas & galon', amount: 240000 },
  { id: 'o20', date: '2026-10-18', cat: 'tagihan', desc: 'Service AC', amount: 400000 },
  // Sekolah Dimas — 2.300.000
  { id: 'o21', date: '2026-10-02', cat: 'sekolah', desc: 'SPP Dimas', amount: 1400000 },
  { id: 'o22', date: '2026-10-06', cat: 'sekolah', desc: 'Les bahasa Inggris', amount: 600000 },
  { id: 'o23', date: '2026-10-14', cat: 'sekolah', desc: 'Buku & alat tulis', amount: 300000 },
  // Kesehatan — 540.000
  { id: 'o24', date: '2026-10-09', cat: 'kesehatan', desc: 'Apotek vitamin', amount: 210000 },
  { id: 'o25', date: '2026-10-17', cat: 'kesehatan', desc: 'Dokter umum', amount: 330000 },
  // Hiburan & Rekreasi — 590.000
  { id: 'o26', date: '2026-10-08', cat: 'hiburan', desc: 'Bioskop keluarga', amount: 260000 },
  { id: 'o27', date: '2026-10-13', cat: 'hiburan', desc: 'Langganan streaming', amount: 149000 },
  { id: 'o28', date: '2026-10-15', cat: 'hiburan', desc: 'Mainan Dimas', amount: 181000 },
  // Arisan & Sosial — 780.000
  { id: 'o29', date: '2026-10-05', cat: 'sosial', desc: 'Arisan RT', amount: 500000 },
  { id: 'o30', date: '2026-10-11', cat: 'sosial', desc: 'Kado ulang tahun', amount: 130000 },
  { id: 'o31', date: '2026-10-24', cat: 'sosial', desc: 'Sumbangan masjid', amount: 150000 },
];

// Pengeluaran September 2026 — total Rp 12.780.000 (31 transaksi).
export const EXPENSES_SEP = [
  // Belanja Pasar — 3.400.000
  { id: 's01', date: '2026-09-03', cat: 'belanja', desc: 'Pasar Beringharjo', amount: 400000 },
  { id: 's02', date: '2026-09-08', cat: 'belanja', desc: 'Super Indo', amount: 700000 },
  { id: 's03', date: '2026-09-13', cat: 'belanja', desc: 'Pasar Beringharjo', amount: 360000 },
  { id: 's04', date: '2026-09-18', cat: 'belanja', desc: 'Super Indo', amount: 900000 },
  { id: 's05', date: '2026-09-24', cat: 'belanja', desc: 'Super Indo', amount: 1040000 },
  // Jajan & Makan Luar — 980.000
  { id: 's06', date: '2026-09-04', cat: 'makan', desc: 'Angkringan', amount: 55000 },
  { id: 's07', date: '2026-09-10', cat: 'makan', desc: 'Kopi & roti', amount: 105000 },
  { id: 's08', date: '2026-09-15', cat: 'makan', desc: 'Resto keluarga', amount: 430000 },
  { id: 's09', date: '2026-09-21', cat: 'makan', desc: 'Makan malam di mal', amount: 390000 },
  // Bensin & Transport — 1.450.000
  { id: 's10', date: '2026-09-02', cat: 'transport', desc: 'Bensin', amount: 320000 },
  { id: 's11', date: '2026-09-08', cat: 'transport', desc: 'Parkir & tol', amount: 165000 },
  { id: 's12', date: '2026-09-13', cat: 'transport', desc: 'Bensin', amount: 295000 },
  { id: 's13', date: '2026-09-19', cat: 'transport', desc: 'Ojek online', amount: 670000 },
  // Listrik, Air & Internet — 2.800.000
  { id: 's14', date: '2026-09-01', cat: 'tagihan', desc: 'Listrik PLN', amount: 990000 },
  { id: 's15', date: '2026-09-03', cat: 'tagihan', desc: 'Air PDAM', amount: 280000 },
  { id: 's16', date: '2026-09-05', cat: 'tagihan', desc: 'Internet & TV', amount: 520000 },
  { id: 's17', date: '2026-09-08', cat: 'tagihan', desc: 'Iuran RT', amount: 150000 },
  { id: 's18', date: '2026-09-11', cat: 'tagihan', desc: 'Pulsa & paket data', amount: 290000 },
  { id: 's19', date: '2026-09-14', cat: 'tagihan', desc: 'Gas & galon', amount: 230000 },
  { id: 's20', date: '2026-09-18', cat: 'tagihan', desc: 'Service AC', amount: 340000 },
  // Sekolah Dimas — 2.300.000
  { id: 's21', date: '2026-09-02', cat: 'sekolah', desc: 'SPP Dimas', amount: 1400000 },
  { id: 's22', date: '2026-09-06', cat: 'sekolah', desc: 'Les bahasa Inggris', amount: 600000 },
  { id: 's23', date: '2026-09-14', cat: 'sekolah', desc: 'Buku & alat tulis', amount: 300000 },
  // Kesehatan — 420.000
  { id: 's24', date: '2026-09-09', cat: 'kesehatan', desc: 'Apotek vitamin', amount: 180000 },
  { id: 's25', date: '2026-09-17', cat: 'kesehatan', desc: 'Dokter gigi Dimas', amount: 240000 },
  // Hiburan & Rekreasi — 610.000
  { id: 's26', date: '2026-09-08', cat: 'hiburan', desc: 'Bioskop keluarga', amount: 270000 },
  { id: 's27', date: '2026-09-13', cat: 'hiburan', desc: 'Langganan streaming', amount: 149000 },
  { id: 's28', date: '2026-09-15', cat: 'hiburan', desc: 'Mainan Dimas', amount: 191000 },
  // Arisan & Sosial — 820.000
  { id: 's29', date: '2026-09-05', cat: 'sosial', desc: 'Arisan RT', amount: 500000 },
  { id: 's30', date: '2026-09-11', cat: 'sosial', desc: 'Kado ulang tahun', amount: 170000 },
  { id: 's31', date: '2026-09-24', cat: 'sosial', desc: 'Sumbangan masjid', amount: 150000 },
];

// Tujuan tabungan. "saved" adalah saldo per 27 Nov 2026.
export const GOALS = [
  { id: 'g-darurat', name: 'Dana Darurat', note: 'Enam bulan biaya hidup, disimpan terpisah.', target: 18000000, saved: 9600000 },
  { id: 'g-motor', name: 'Motor Baru', note: 'Ganti motor lama Andi yang sudah sering mogok.', target: 12000000, saved: 4250000 },
  { id: 'g-bali', name: 'Liburan ke Bali', note: 'Empat hari di Bali saat libur sekolah Dimas.', target: 6500000, saved: 2800000 },
  { id: 'g-kamar', name: 'Renovasi Kamar Dimas', note: 'Cat baru, meja belajar, dan rak buku.', target: 9000000, saved: 1500000 },
];

// Target tabungan bulanan keluarga (dipakai Dasbor: sisa setelah tabungan).
export const SAVINGS_TARGET = 3500000;

// Tagihan tetap bulanan (November 2026). "paid" = sudah dibayar bulan ini;
// yang lunas cocok dengan transaksi di atas, yang belum tidak ada transaksinya.
export const BILLS = [
  { id: 'b-spp', name: 'SPP Dimas', amount: 1400000, due: 2, paid: true },
  { id: 'b-listrik', name: 'Listrik PLN', amount: 980000, due: 5, paid: true },
  { id: 'b-les', name: 'Les bahasa Inggris', amount: 600000, due: 6, paid: true },
  { id: 'b-air', name: 'Air PDAM', amount: 285000, due: 10, paid: true },
  { id: 'b-rt', name: 'Iuran RT', amount: 150000, due: 10, paid: true },
  { id: 'b-bpjs', name: 'BPJS Kesehatan', amount: 230000, due: 10, paid: false },
  { id: 'b-stream', name: 'Langganan streaming', amount: 149000, due: 12, paid: false },
  { id: 'b-internet', name: 'Internet & TV', amount: 520000, due: 15, paid: true },
];
