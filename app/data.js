// Data contoh Keluarga Hartono (keluarga fiktif, Jakarta) untuk DompetKita.
// Semua angka dalam rupiah. Bulan ditampilkan: Oktober dan November 2026.
// Data ini hanya benih awal: perubahan pengguna (transaksi baru, ubah anggaran,
// tambah dana tujuan) disimpan di localStorage oleh store.js dan menimpa benih ini.

export const FAMILY = {
  name: 'Keluarga Hartono',
  members: 'Budi, Sari, Nadia (12) & Raka (8)',
  city: 'Jakarta Timur',
  currency: 'IDR',
};

export const MONTHS = [
  { id: '2026-10', label: 'Oktober 2026' },
  { id: '2026-11', label: 'November 2026' },
];

export const CATEGORIES = [
  { id: 'belanja',    name: 'Belanja Harian',      short: 'BH', color: '#2e7d4f', budget: 4000000 },
  { id: 'makan',      name: 'Makan di Luar',       short: 'ML', color: '#d97706', budget: 1200000 },
  { id: 'transport',  name: 'Transportasi',        short: 'TR', color: '#2563eb', budget: 1500000 },
  { id: 'tagihan',    name: 'Tagihan & Utilitas',  short: 'TG', color: '#7c3aed', budget: 2800000 },
  { id: 'pendidikan', name: 'Pendidikan Anak',     short: 'PD', color: '#0891b2', budget: 2500000 },
  { id: 'kesehatan',  name: 'Kesehatan',           short: 'KS', color: '#dc2626', budget: 800000 },
  { id: 'hiburan',    name: 'Hiburan & Rekreasi',  short: 'HB', color: '#db2777', budget: 600000 },
  { id: 'lain',       name: 'Lain-lain',           short: 'LL', color: '#64748b', budget: 500000 },
];

export const SAVINGS_TARGET = 3000000;

export const GOALS = [
  { id: 'darurat',   name: 'Dana Darurat',            detail: 'Cadangan 3 bulan pengeluaran', target: 30000000, saved: 18750000 },
  { id: 'liburan',   name: 'Liburan ke Yogyakarta',   detail: 'Libur sekolah, Juni 2027',     target: 8000000,  saved: 5200000 },
  { id: 'laptop',    name: 'Laptop untuk Nadia',      detail: 'Untuk tugas sekolah',          target: 7500000,  saved: 2250000 },
  { id: 'dapur',     name: 'Renovasi Dapur',          detail: 'Ganti kompor & meja dapur',    target: 15000000, saved: 4500000 },
];

// Pemasukan per bulan: { month, date, desc, amount }
export const INCOME = [
  { month: '2026-10', date: '2026-10-01', desc: 'Gaji Budi — PT Sinar Pagi', amount: 12500000 },
  { month: '2026-10', date: '2026-10-01', desc: 'Gaji Sari — SDN 04 Cakung', amount: 8000000 },
  { month: '2026-10', date: '2026-10-20', desc: 'Jualan kue Sari', amount: 1250000 },
  { month: '2026-11', date: '2026-11-01', desc: 'Gaji Budi — PT Sinar Pagi', amount: 12500000 },
  { month: '2026-11', date: '2026-11-01', desc: 'Gaji Sari — SDN 04 Cakung', amount: 8000000 },
  { month: '2026-11', date: '2026-11-15', desc: 'Jualan kue Sari', amount: 1750000 },
];

// Pengeluaran per bulan: { month, date, desc, cat, amount }
// Jumlah per kategori November: belanja 3.215.000, makan 845.000, transport 1.120.000,
// tagihan 2.650.000, pendidikan 2.500.000, kesehatan 350.000, hiburan 480.000, lain 210.000.
export const EXPENSES = [
  // --- Oktober 2026 (total 11.900.000) ---
  { month: '2026-10', date: '2026-10-03', desc: 'Pasar Minggu — sayur & buah', cat: 'belanja', amount: 410000 },
  { month: '2026-10', date: '2026-10-07', desc: 'Super Indo — belanja mingguan', cat: 'belanja', amount: 720000 },
  { month: '2026-10', date: '2026-10-14', desc: 'Pasar Minggu — sayur & buah', cat: 'belanja', amount: 355000 },
  { month: '2026-10', date: '2026-10-18', desc: 'Super Indo — belanja mingguan', cat: 'belanja', amount: 640000 },
  { month: '2026-10', date: '2026-10-21', desc: 'Tukang sayur keliling', cat: 'belanja', amount: 190000 },
  { month: '2026-10', date: '2026-10-25', desc: 'Super Indo — belanja mingguan', cat: 'belanja', amount: 705000 },
  { month: '2026-10', date: '2026-10-28', desc: 'Indomaret — kebutuhan dapur', cat: 'belanja', amount: 460000 },
  { month: '2026-10', date: '2026-10-05', desc: 'Warteg Bahari — makan siang', cat: 'makan', amount: 110000 },
  { month: '2026-10', date: '2026-10-11', desc: 'Bakso Pakde — makan keluarga', cat: 'makan', amount: 240000 },
  { month: '2026-10', date: '2026-10-17', desc: 'Nasi Padang Sederhana', cat: 'makan', amount: 195000 },
  { month: '2026-10', date: '2026-10-24', desc: 'Ayam Geprek — makan malam', cat: 'makan', amount: 145000 },
  { month: '2026-10', date: '2026-10-29', desc: 'Kopi & roti — Sari', cat: 'makan', amount: 230000 },
  { month: '2026-10', date: '2026-10-02', desc: 'Bensin Pertalite', cat: 'transport', amount: 260000 },
  { month: '2026-10', date: '2026-10-09', desc: 'Tol + parkir', cat: 'transport', amount: 210000 },
  { month: '2026-10', date: '2026-10-16', desc: 'Bensin Pertalite', cat: 'transport', amount: 255000 },
  { month: '2026-10', date: '2026-10-20', desc: 'Ojek online — Sari', cat: 'transport', amount: 130000 },
  { month: '2026-10', date: '2026-10-24', desc: 'Bensin Pertalite', cat: 'transport', amount: 240000 },
  { month: '2026-10', date: '2026-10-30', desc: 'Tol + parkir', cat: 'transport', amount: 210000 },
  { month: '2026-10', date: '2026-10-05', desc: 'Listrik PLN', cat: 'tagihan', amount: 640000 },
  { month: '2026-10', date: '2026-10-05', desc: 'Air PAM', cat: 'tagihan', amount: 138000 },
  { month: '2026-10', date: '2026-10-06', desc: 'Internet IndiHome', cat: 'tagihan', amount: 345000 },
  { month: '2026-10', date: '2026-10-10', desc: 'Iuran RT + keamanan', cat: 'tagihan', amount: 150000 },
  { month: '2026-10', date: '2026-10-12', desc: 'BPJS Kesehatan', cat: 'tagihan', amount: 280000 },
  { month: '2026-10', date: '2026-10-15', desc: 'Cicilan motor', cat: 'tagihan', amount: 1057000 },
  { month: '2026-10', date: '2026-10-01', desc: 'SPP Nadia', cat: 'pendidikan', amount: 1250000 },
  { month: '2026-10', date: '2026-10-01', desc: 'SPP Raka', cat: 'pendidikan', amount: 950000 },
  { month: '2026-10', date: '2026-10-09', desc: 'Buku & alat tulis', cat: 'pendidikan', amount: 180000 },
  { month: '2026-10', date: '2026-10-17', desc: 'Les renang Raka', cat: 'pendidikan', amount: 120000 },
  { month: '2026-10', date: '2026-10-04', desc: 'Apotek — vitamin', cat: 'kesehatan', amount: 165000 },
  { month: '2026-10', date: '2026-10-13', desc: 'Dokter anak — Raka', cat: 'kesehatan', amount: 345000 },
  { month: '2026-10', date: '2026-10-08', desc: 'Nonton bioskop keluarga', cat: 'hiburan', amount: 246000 },
  { month: '2026-10', date: '2026-10-16', desc: 'Langganan streaming', cat: 'hiburan', amount: 149000 },
  { month: '2026-10', date: '2026-10-06', desc: 'Pulsa Budi', cat: 'lain', amount: 75000 },
  { month: '2026-10', date: '2026-10-20', desc: 'Servis dispenser', cat: 'lain', amount: 105000 },
  // --- November 2026 (total 11.370.000) ---
  { month: '2026-11', date: '2026-11-02', desc: 'Pasar Minggu — sayur & buah', cat: 'belanja', amount: 385000 },
  { month: '2026-11', date: '2026-11-05', desc: 'Super Indo — belanja mingguan', cat: 'belanja', amount: 612000 },
  { month: '2026-11', date: '2026-11-09', desc: 'Pasar Minggu — sayur & buah', cat: 'belanja', amount: 298000 },
  { month: '2026-11', date: '2026-11-12', desc: 'Super Indo — belanja mingguan', cat: 'belanja', amount: 545000 },
  { month: '2026-11', date: '2026-11-16', desc: 'Tukang sayur keliling', cat: 'belanja', amount: 175000 },
  { month: '2026-11', date: '2026-11-19', desc: 'Super Indo — belanja mingguan', cat: 'belanja', amount: 590000 },
  { month: '2026-11', date: '2026-11-23', desc: 'Pasar Minggu — sayur & buah', cat: 'belanja', amount: 342000 },
  { month: '2026-11', date: '2026-11-25', desc: 'Indomaret — kebutuhan dapur', cat: 'belanja', amount: 268000 },
  { month: '2026-11', date: '2026-11-03', desc: 'Warteg Bahari — makan siang', cat: 'makan', amount: 96000 },
  { month: '2026-11', date: '2026-11-08', desc: 'Ayam Geprek — makan malam', cat: 'makan', amount: 128000 },
  { month: '2026-11', date: '2026-11-14', desc: 'Bakso Pakde — makan keluarga', cat: 'makan', amount: 215000 },
  { month: '2026-11', date: '2026-11-18', desc: 'Kopi & roti — Sari', cat: 'makan', amount: 87000 },
  { month: '2026-11', date: '2026-11-21', desc: 'Nasi Padang Sederhana', cat: 'makan', amount: 178000 },
  { month: '2026-11', date: '2026-11-24', desc: 'Mie Ayam — Budi', cat: 'makan', amount: 141000 },
  { month: '2026-11', date: '2026-11-01', desc: 'Bensin Pertalite', cat: 'transport', amount: 250000 },
  { month: '2026-11', date: '2026-11-07', desc: 'Tol + parkir', cat: 'transport', amount: 185000 },
  { month: '2026-11', date: '2026-11-11', desc: 'Bensin Pertalite', cat: 'transport', amount: 250000 },
  { month: '2026-11', date: '2026-11-15', desc: 'Ojek online — Sari', cat: 'transport', amount: 96000 },
  { month: '2026-11', date: '2026-11-19', desc: 'Tol + parkir', cat: 'transport', amount: 142000 },
  { month: '2026-11', date: '2026-11-22', desc: 'Bensin Pertalite', cat: 'transport', amount: 197000 },
  { month: '2026-11', date: '2026-11-05', desc: 'Listrik PLN', cat: 'tagihan', amount: 685000 },
  { month: '2026-11', date: '2026-11-05', desc: 'Air PAM', cat: 'tagihan', amount: 142000 },
  { month: '2026-11', date: '2026-11-06', desc: 'Internet IndiHome', cat: 'tagihan', amount: 345000 },
  { month: '2026-11', date: '2026-11-10', desc: 'Iuran RT + keamanan', cat: 'tagihan', amount: 150000 },
  { month: '2026-11', date: '2026-11-12', desc: 'BPJS Kesehatan', cat: 'tagihan', amount: 280000 },
  { month: '2026-11', date: '2026-11-15', desc: 'Cicilan motor', cat: 'tagihan', amount: 1048000 },
  { month: '2026-11', date: '2026-11-01', desc: 'SPP Nadia', cat: 'pendidikan', amount: 1250000 },
  { month: '2026-11', date: '2026-11-01', desc: 'SPP Raka', cat: 'pendidikan', amount: 950000 },
  { month: '2026-11', date: '2026-11-09', desc: 'Buku & alat tulis', cat: 'pendidikan', amount: 185000 },
  { month: '2026-11', date: '2026-11-17', desc: 'Les renang Raka', cat: 'pendidikan', amount: 115000 },
  { month: '2026-11', date: '2026-11-04', desc: 'Apotek — vitamin', cat: 'kesehatan', amount: 128000 },
  { month: '2026-11', date: '2026-11-13', desc: 'Periksa gigi Nadia', cat: 'kesehatan', amount: 222000 },
  { month: '2026-11', date: '2026-11-08', desc: 'Nonton bioskop keluarga', cat: 'hiburan', amount: 265000 },
  { month: '2026-11', date: '2026-11-16', desc: 'Langganan streaming', cat: 'hiburan', amount: 149000 },
  { month: '2026-11', date: '2026-11-22', desc: 'Mainan Raka', cat: 'hiburan', amount: 66000 },
  { month: '2026-11', date: '2026-11-06', desc: 'Servis kipas angin', cat: 'lain', amount: 135000 },
  { month: '2026-11', date: '2026-11-20', desc: 'Pulsa Budi', cat: 'lain', amount: 75000 },
];
