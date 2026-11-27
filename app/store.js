// State aplikasi: benih dari data.js + perubahan pengguna di localStorage.
// Kunci penyimpanan: "dompetkita-v2". Semua hitungan bulan berjalan di sini,
// supaya view hanya merender angka yang sudah benar.

import {
  CATEGORIES,
  CURRENT_MONTH,
  EXPENSES_NOV,
  EXPENSES_OCT,
  GOALS,
  INCOME,
  MONTHS,
  SAVINGS_TARGET,
} from './data.js';

const KEY = 'dompetkita-v2';

export function loadUserState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
      budgets: parsed.budgets && typeof parsed.budgets === 'object' ? parsed.budgets : {},
      goals: parsed.goals && typeof parsed.goals === 'object' ? parsed.goals : {},
    };
  } catch {
    return freshState();
  }
}

function freshState() {
  return { added: [], deleted: [], budgets: {}, goals: {} };
}

export function saveUserState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetUserState() {
  localStorage.removeItem(KEY);
  return freshState();
}

// Bulan aktif: id "2026-11" (November 2026, bulan berjalan).
export let currentMonth = CURRENT_MONTH;

export function monthLabel(id) {
  const found = MONTHS.find((m) => m.id === id);
  return found ? found.label : id;
}

export function monthShort(id) {
  const found = MONTHS.find((m) => m.id === id);
  return found ? found.short : id;
}

export function prevMonth(id) {
  const i = MONTHS.findIndex((m) => m.id === id);
  return i > 0 ? MONTHS[i - 1].id : null;
}

export function nextMonth(id) {
  const i = MONTHS.findIndex((m) => m.id === id);
  return i >= 0 && i < MONTHS.length - 1 ? MONTHS[i + 1].id : null;
}

export function setCurrentMonth(id) {
  if (MONTHS.some((m) => m.id === id)) currentMonth = id;
}

// Semua transaksi (pemasukan + pengeluaran) untuk satu bulan:
// benih digabung dengan tambahan pengguna, dikurangi yang dihapus.
export function transactionsFor(month, state) {
  const out = [];
  INCOME.forEach((row) => {
    if (row.month !== month) return;
    if (state.deleted.includes(row.id)) return;
    out.push({ id: row.id, date: row.date, desc: row.source, cat: null, amount: row.amount, kind: 'in' });
  });
  const seed = month === '2026-11' ? EXPENSES_NOV : EXPENSES_OCT;
  seed.forEach((row) => {
    if (state.deleted.includes(row.id)) return;
    out.push({ id: row.id, date: row.date, desc: row.desc, cat: row.cat, amount: row.amount, kind: 'out' });
  });
  state.added.forEach((row) => {
    if (row.month !== month) return;
    out.push({ id: row.id, date: row.date, desc: row.desc, cat: row.cat, amount: row.amount, kind: row.kind });
  });
  out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return out;
}

export function incomeTotal(month, state) {
  return transactionsFor(month, state)
    .filter((t) => t.kind === 'in')
    .reduce((s, t) => s + t.amount, 0);
}

export function expenseTotal(month, state) {
  return transactionsFor(month, state)
    .filter((t) => t.kind === 'out')
    .reduce((s, t) => s + t.amount, 0);
}

// Anggaran per kategori untuk satu bulan: pagu (bisa diubah pengguna)
// dan realisasi dari transaksi. Status: 'aman' (<=85%), 'hati-hati' (<=100%),
// 'lewat' (>100%).
export function categoryRows(month, state) {
  const spent = {};
  transactionsFor(month, state).forEach((t) => {
    if (t.kind === 'out' && t.cat) spent[t.cat] = (spent[t.cat] || 0) + t.amount;
  });
  return CATEGORIES.map((c) => {
    const budget = state.budgets[c.id] != null ? state.budgets[c.id] : c.budget;
    const used = spent[c.id] || 0;
    const ratio = budget > 0 ? used / budget : 0;
    const status = ratio > 1 ? 'lewat' : ratio > 0.85 ? 'hati-hati' : 'aman';
    return { ...c, budget, used, left: budget - used, ratio, status };
  });
}

export function budgetTotals(month, state) {
  const rows = categoryRows(month, state);
  return {
    budget: rows.reduce((s, r) => s + r.budget, 0),
    used: rows.reduce((s, r) => s + r.used, 0),
  };
}

// Perbandingan bulan ini vs bulan lalu, per kategori.
export function compareRows(month, state) {
  const prev = prevMonth(month);
  if (!prev) return null;
  const now = categoryRows(month, state);
  const before = categoryRows(prev, state);
  const beforeById = {};
  before.forEach((r) => { beforeById[r.id] = r.used; });
  return {
    prev,
    rows: now.map((r) => {
      const old = beforeById[r.id] || 0;
      return {
        ...r,
        old,
        delta: r.used - old,
        deltaRatio: old > 0 ? (r.used - old) / old : 0,
      };
    }),
  };
}

// Pengeluaran terbesar bulan ini (untuk Laporan + Dasbor).
export function topExpenses(month, state, n) {
  return transactionsFor(month, state)
    .filter((t) => t.kind === 'out')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n || 5);
}

// Tujuan tabungan dengan tambahan dana pengguna.
export function goalRows(state) {
  return GOALS.map((g) => {
    const extra = state.goals[g.id] || 0;
    const saved = g.saved + extra;
    return { ...g, saved, ratio: g.target > 0 ? saved / g.target : 0, left: g.target - saved };
  });
}

export function savingsTotal(state) {
  return goalRows(state).reduce((s, g) => s + g.saved, 0);
}

// Ringkasan satu bulan untuk dasbor.
export function monthSummary(month, state) {
  const income = incomeTotal(month, state);
  const expense = expenseTotal(month, state);
  const rest = income - expense;
  const saving = SAVINGS_TARGET;
  return {
    income,
    expense,
    rest,
    saving,
    free: rest - saving,
    savingsRate: income > 0 ? rest / income : 0,
    spendRate: income > 0 ? expense / income : 0,
  };
}
