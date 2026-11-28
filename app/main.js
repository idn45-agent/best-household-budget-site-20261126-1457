// Titik masuk situs: router hash + semua aksi pengguna.
// Rute: #/ dasbor, #/anggaran, #/transaksi, #/kategori (daftar),
// #/kategori/<id> (rincian), #/tujuan, #/rencana, #/tagihan, #/laporan.
// Aksi (delegasi klik/submit di document): ganti bulan, tambah/hapus transaksi,
// simpan pagu, tambah dana tujuan, centang tagihan, simulasi tabungan,
// muat ulang data contoh.

import { CATEGORIES } from './data.js';
import {
  loadUserState,
  resetUserState,
  saveUserState,
  setCurrentMonth,
} from './store.js';
import {
  afterBudget,
  afterDashboard,
  afterReport,
  updateSimulation,
  viewBills,
  viewBudget,
  viewCategories,
  viewCategory,
  viewDashboard,
  viewGoals,
  viewPlanner,
  viewReport,
  viewTransactions,
} from './views.js';

const view = document.getElementById('view');
let state = loadUserState();

function route() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/');
  let html = '';
  let after = null;
  if (parts[0] === '' || parts[0] === undefined) {
    html = viewDashboard(state);
    after = afterDashboard;
  } else if (parts[0] === 'anggaran') {
    html = viewBudget(state);
    after = afterBudget;
  } else if (parts[0] === 'transaksi') {
    html = viewTransactions(state);
  } else if (parts[0] === 'kategori' && parts[1]) {
    html = viewCategory(state, parts[1]);
  } else if (parts[0] === 'kategori') {
    html = viewCategories(state);
  } else if (parts[0] === 'tujuan') {
    html = viewGoals(state);
  } else if (parts[0] === 'rencana') {
    html = viewPlanner(state);
  } else if (parts[0] === 'tagihan') {
    html = viewBills(state);
  } else if (parts[0] === 'laporan') {
    html = viewReport(state);
    after = afterReport;
  } else {
    html = viewDashboard(state);
    after = afterDashboard;
  }
  view.innerHTML = html;
  if (after) after(state);
  markActiveNav(parts[0] || '');
  window.scrollTo(0, 0);
}

function markActiveNav(section) {
  document.querySelectorAll('nav a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const sec = href.replace(/^#\//, '').split('/')[0];
    a.classList.toggle('active', sec === section || (section === '' && sec === ''));
  });
}

function rerender() {
  route();
}

// --- Aksi: ganti bulan (tombol ‹ › di monthnav, tetap di halaman yang sama) ---
document.addEventListener('click', (e) => {
  const monthBtn = e.target.closest('[data-month]');
  if (monthBtn) {
    setCurrentMonth(monthBtn.getAttribute('data-month'));
    rerender();
    return;
  }
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.getAttribute('data-action');
  if (action === 'del-tx') {
    const id = el.getAttribute('data-id');
    if (!state.deleted.includes(id)) state.deleted.push(id);
    // Transaksi tambahan dihapus dari daftar tambahan.
    state.added = state.added.filter((t) => t.id !== id);
    saveUserState(state);
    rerender();
  } else if (action === 'save-budget') {
    const cat = el.getAttribute('data-cat');
    const input = document.querySelector('.budget-input[data-cat="' + cat + '"]');
    const value = input ? Math.round(Number(input.value)) : NaN;
    if (Number.isFinite(value) && value >= 0) {
      state.budgets[cat] = value;
      saveUserState(state);
      el.textContent = 'Tersimpan ✓';
      setTimeout(rerender, 500);
    } else if (input) {
      input.focus();
    }
  } else if (action === 'toggle-bill') {
    // Checkbox tagihan: klik langsung mengubah status (change event di bawah
    // yang menangani penyimpanan; klik di sini hanya mencegah rerender ganda).
  } else if (action === 'reset-data') {
    state = resetUserState();
    rerender();
  }
});

// --- Aksi: centang tagihan (change pada checkbox) ---
document.addEventListener('change', (e) => {
  const el = e.target;
  if (el.matches('[data-action="toggle-bill"]')) {
    const id = el.getAttribute('data-id');
    state.bills[id] = el.checked;
    saveUserState(state);
    rerender();
    return;
  }
  if (el.id === 'tx-filter') filterTransactions();
  if (el.id === 'sim-amount' || el.id === 'sim-goal') updateSimulation(state);
  if (el.name === 'kind' && el.form && el.form.id === 'add-tx') {
    const cat = el.form.querySelector('select[name="cat"]');
    if (cat) cat.disabled = el.value === 'in';
  }
});

// --- Aksi: tambah transaksi + tambah dana tujuan + simulasi (submit form) ---
document.addEventListener('submit', (e) => {
  const form = e.target;
  if (form.id === 'add-tx') {
    e.preventDefault();
    const data = new FormData(form);
    const kind = data.get('kind') === 'in' ? 'in' : 'out';
    const amount = Math.round(Number(data.get('amount')));
    const desc = String(data.get('desc') || '').trim();
    const date = String(data.get('date') || '');
    const msg = document.getElementById('add-msg');
    if (!desc || !Number.isFinite(amount) || amount <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      if (msg) msg.textContent = 'Isi tanggal, keterangan, dan jumlah yang benar.';
      return;
    }
    const month = date.slice(0, 7);
    state.added.push({
      id: 'user-' + Date.now().toString(36),
      month,
      date,
      desc,
      cat: kind === 'out' ? String(data.get('cat')) : null,
      amount,
      kind,
    });
    saveUserState(state);
    setCurrentMonth(month);
    if (msg) msg.textContent = 'Tersimpan: ' + desc + ' (' + (kind === 'in' ? '+' : '−') + amount + ').';
    setTimeout(rerender, 600);
  } else if (form.classList.contains('goal-form')) {
    e.preventDefault();
    const goalId = form.getAttribute('data-goal');
    const amount = Math.round(Number(new FormData(form).get('amount')));
    if (!Number.isFinite(amount) || amount <= 0) return;
    state.goals[goalId] = (state.goals[goalId] || 0) + amount;
    saveUserState(state);
    rerender();
  } else if (form.id === 'sim-form') {
    e.preventDefault();
    updateSimulation(state);
  }
});

// --- Filter daftar transaksi (ketik + pilih kategori) ---
document.addEventListener('input', (e) => {
  if (e.target.id === 'tx-search' || e.target.id === 'tx-filter') filterTransactions();
  if (e.target.id === 'sim-amount') updateSimulation(state);
});

function filterTransactions() {
  const list = document.getElementById('tx-list');
  if (!list) return;
  const q = (document.getElementById('tx-search').value || '').toLowerCase();
  const f = document.getElementById('tx-filter').value;
  list.querySelectorAll('tbody tr').forEach((tr) => {
    const text = tr.textContent.toLowerCase();
    const catCell = tr.children[2] ? tr.children[2].textContent : '';
    const catId = (CATEGORIES.find((c) => c.name === catCell) || {}).id || '';
    const isIncome = catCell === 'Pemasukan';
    const matchQ = !q || text.includes(q);
    const matchF = !f || (f === '__in' ? isIncome : catId === f);
    tr.style.display = matchQ && matchF ? '' : 'none';
  });
}

window.addEventListener('hashchange', route);
route();
