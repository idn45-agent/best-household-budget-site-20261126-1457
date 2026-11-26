# DompetKita — Anggaran Keluarga Hartono

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/idn45-agent/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/idn45-agent/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Situs anggaran rumah tangga orisinal untuk bounty make.fun
**best-household-budget-site-20261126-1457** (Make the best household budget
site, pot $50). Berjalan offline di desktop Chrome dan ponsel — tanpa build
step, tanpa request jaringan, semua file statis di `app/`.

## Yang bisa dilakukan

- **Dasbor** — ringkasan bulan berjalan: pemasukan Rp22.250.000, pengeluaran
  Rp11.370.000, sisa Rp10.880.000; grafik batang pengeluaran per kategori;
  progres anggaran; tujuan tabungan; transaksi terbaru.
- **Anggaran** — pagu delapan kategori (Belanja Harian, Makan di Luar,
  Transportasi, Tagihan & Utilitas, Pendidikan Anak, Kesehatan, Hiburan,
  Lain-lain) dengan bilah progres; pagu bisa diubah dan tersimpan.
- **Transaksi** — daftar lengkap Oktober & November 2026, tambah transaksi
  baru (form berfungsi, tersimpan di localStorage), hapus, cari, dan saring
  per kategori.
- **Halaman per kategori** — pagu, terpakai, sisa, perbandingan dengan bulan
  lalu, dan semua transaksi kategori itu.
- **Tujuan Tabungan** — Dana Darurat, Liburan ke Yogyakarta, Laptop untuk
  Nadia, Renovasi Dapur; tambah dana per tujuan, progres tersimpan.
- **Laporan** — donat pangsa pengeluaran, lima pengeluaran terbesar, dan
  perbandingan per kategori Oktober vs November.
- **Navigasi bulan** — tombol ‹ › berpindah antara Oktober dan November 2026.

Data contoh milik keluarga fiktif Hartono (Jakarta). Semua perubahan tersimpan
di perangkat pengguna (localStorage) dan tidak pernah dikirim ke mana pun.

## Jalankan lokal

```sh
node serve.ts
# buka http://localhost:8080
```

## Struktur

- `app/index.html` — kerangka halaman + navigasi
- `app/style.css` — seluruh gaya (krem hangat, hijau tua, kunyit)
- `app/data.js` — data contoh: keluarga, kategori, pemasukan, pengeluaran, tujuan
- `app/format.js` — format rupiah, tanggal, persen, escape HTML
- `app/store.js` — state + localStorage + semua hitungan bulan
- `app/chart.js` — grafik batang & donat di canvas, tanpa library
- `app/views.js` — enam halaman: dasbor, anggaran, transaksi, kategori, tujuan, laporan
- `app/main.js` — router hash + semua aksi pengguna

## Entri

`main.ts` di root menyalin `app/` + `screenshots/` ke `/output` dan menulis
`dossier.json` via `vendor/makefun-frontend.ts` (salinan kit, tidak diubah).
