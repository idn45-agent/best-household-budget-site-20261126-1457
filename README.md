# DompetKita — Buku Kas Keluarga Santoso

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/idn45-agent/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/idn45-agent/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Buku kas rumah tangga orisinal untuk bounty make.fun
**best-household-budget-site-20261126-1457** (Make the best household budget
site, pot $50). Berjalan offline di desktop Chrome dan ponsel — tanpa build
step, tanpa request jaringan, semua file statis di `app/`.

## Yang bisa dilakukan

- **Dasbor** — ringkasan bulan berjalan: pemasukan Rp23.850.000, pengeluaran
  Rp13.410.000, sisa Rp10.440.000 (43,8% dari pemasukan); donat pangsa
  pengeluaran; tren tiga bulan; sisa aman harian; wawasan otomatis; anggaran;
  tujuan tabungan; transaksi terbaru.
- **Anggaran** — pagu delapan kategori (Belanja Pasar, Jajan & Makan Luar,
  Bensin & Transport, Listrik Air & Internet, Sekolah Dimas, Kesehatan,
  Hiburan & Rekreasi, Arisan & Sosial) dengan bilah progres dan grafik
  terpakai vs pagu; pagu bisa diubah dan tersimpan.
- **Transaksi** — daftar lengkap September, Oktober & November 2026, tambah
  transaksi baru (form berfungsi, tersimpan di localStorage), hapus, cari,
  dan saring per kategori.
- **Halaman per kategori** — pagu, terpakai, sisa, perbandingan dengan bulan
  lalu, sisa aman harian kategori itu, dan semua transaksi kategori itu.
- **Tujuan Tabungan** — Dana Darurat, Motor Baru, Liburan ke Bali, Renovasi
  Kamar Dimas; tambah dana per tujuan, progres tersimpan.
- **Rencana (baru)** — Sisa Aman Harian: sisa pagu tiap kategori dibagi 3 hari
  tersisa di bulan ini; Simulasi Tabungan: masukkan jumlah sisihan per bulan,
  lihat berapa bulan lagi tiap tujuan lunas dan bulan selesainya.
- **Tagihan (baru)** — delapan tagihan tetap bulanan dengan tanggal jatuh
  tempo; centang yang sudah lunas (tersimpan), ringkasan lunas/belum lunas,
  dan tagihan berikutnya yang harus dibayar.
- **Laporan** — donat pangsa pengeluaran, lima pengeluaran terbesar, grafik
  garis tren tiga bulan, tabel perbandingan per kategori Sep vs Okt vs Nov,
  dan semua wawasan.
- **Navigasi bulan** — tombol ‹ › berpindah antara September, Oktober, dan
  November 2026 tanpa meninggalkan halaman yang sedang dibuka.

Data contoh milik keluarga fiktif Santoso (Yogyakarta). Semua perubahan
tersimpan di perangkat pengguna (localStorage) dan tidak pernah dikirim ke
mana pun.

## Jalankan lokal

```sh
node serve.ts
# buka http://localhost:8080
```

## Struktur

- `app/index.html` — kerangka halaman + navigasi
- `app/style.css` — seluruh gaya (buku kas: kertas krem, navy, amber, judul serif)
- `app/data.js` — data contoh: keluarga, kategori, pemasukan, pengeluaran 3 bulan, tujuan, tagihan
- `app/format.js` — format rupiah, tanggal, persen, escape HTML
- `app/store.js` — state + localStorage + semua hitungan bulan
- `app/chart.js` — grafik donat, batang, dan garis tren di canvas, tanpa library
- `app/insights.js` — wawasan otomatis dari angka (pagu, perbandingan, tren, tagihan)
- `app/planner.js` — sisa aman harian + simulasi tabungan
- `app/bills.js` — label dan ringkasan tagihan tetap
- `app/views.js` — sembilan halaman: dasbor, anggaran, transaksi, kategori, tujuan, rencana, tagihan, laporan
- `app/main.js` — router hash + semua aksi pengguna

## Entri

`main.ts` di root menyalin `app/` + `screenshots/` ke `/output` dan menulis
`dossier.json` via `vendor/makefun-frontend.ts` (salinan kit, tidak diubah).
