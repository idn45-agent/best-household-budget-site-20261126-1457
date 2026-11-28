// Format angka dan teks untuk DompetKita v3. Semua rupiah tanpa desimal,
// dipisah ribuan dengan titik, dan persen satu angka di belakang koma.

export function rupiah(n) {
  const v = Math.round(Number(n) || 0);
  const sign = v < 0 ? '−' : '';
  return 'Rp' + sign + Math.abs(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function rupiahSingkat(n) {
  const v = Math.abs(Number(n) || 0);
  if (v >= 1000000) {
    const j = v / 1000000;
    return 'Rp' + (j % 1 === 0 ? j : j.toFixed(1).replace('.', ',')) + ' jt';
  }
  if (v >= 1000) return 'Rp' + Math.round(v / 1000) + ' rb';
  return 'Rp' + v;
}

export function persen(ratio) {
  return (Number(ratio || 0) * 100).toFixed(1).replace('.', ',') + '%';
}

export function deltaRupiah(d) {
  const v = Math.round(Number(d) || 0);
  if (v > 0) return '+' + rupiah(v);
  if (v < 0) return '−' + rupiah(Math.abs(v));
  return 'Rp0';
}

export function deltaPersen(ratio) {
  const v = Number(ratio || 0);
  if (v > 0) return '+' + persen(v);
  if (v < 0) return '−' + persen(Math.abs(v));
  return '0,0%';
}

export function tanggalSingkat(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return d + ' ' + (bulan[m - 1] || '') + ' ' + y;
}

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
