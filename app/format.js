// Format rupiah, tanggal, dan persen — satu-satunya tempat pemformatan angka.

const RUPIAH = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

// Rp22.250.000
export function rupiah(n) {
  return RUPIAH.format(Math.round(n));
}

// Rp22,25 jt — bentuk singkat untuk label grafik
export function rupiahSingkat(n) {
  if (n >= 1000000) return 'Rp' + trim1(n / 1000000) + ' jt';
  if (n >= 1000) return 'Rp' + trim1(n / 1000) + ' rb';
  return 'Rp' + Math.round(n);
}

function trim1(v) {
  return (Math.round(v * 10) / 10).toString().replace('.', ',');
}

// "2 Nov 2026" dari "2026-11-02"
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function tanggalSingkat(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return d + ' ' + BULAN[m - 1] + ' ' + y;
}

// 0,63 -> "63%"
export function persen(v) {
  return Math.round(v * 100) + '%';
}

// Escape teks pengguna sebelum dimasukkan ke HTML.
export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
