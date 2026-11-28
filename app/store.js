// State pengguna DompetKita v3: perubahan tersimpan di localStorage dan
// tidak pernah dikirim ke mana pun. Semua ringkasan dihitung dari data benih
// (data.js) ditambah state ini, jadi angka di layar selalu konsisten.

import {
  BILLS,
  CATEGORIES,
  CURRENT_MONTH,
  EXPENSES_NOV,
  EXPENSES_OCT,
  EXPENSES_SEP,
  GOALS,
  INCOME,
  MONTHS,
  SAVINGS_TARGET,
} from './data.js';

const KEY = 'dompetkita-v3';

export let currentMonth = CURRENT_MONTH;

export function setCurrentMonth(m) {
  if (MONTHS.some((x) => x.id === m)) currentMonth = m;
}

export function monthIndex(id) {
  return MONTHS.findIndex((m) => m.id === id);
}

export function monthLabel(id) {
  return (MONTHS.find((m) => m.id === id) || { label: id }).label;
}

export function monthShort(id) {
  return (MONTHS.find((m) => m.id === id) || { short: id }).short;
}

export function prevMonth(id) {
  const i = monthIndex(id);
  return i > 0 ? MONTHS[i - 1].id : null;
}

export function nextMonth(id) {
  const i = monthIndex(id);
  return i >= 0 && i < MONTHS.length - 1 ? MONTHS[i + 1].id : null;
}

function seedExpenses(month) {
  if (month === '2026-11') return EXPENSES_NOV;
  if (month === '2026-10') return EXPENSES_OCT;
  if (month === '2026-09') return EXPENSES_SEP;
  return [];
}

export function defaultState() {
  return { deleted: [], added: [], budgets: {}, goals: {}, bills: {}, month: CURRENT_MONTH };
}

export function loadUserState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const st = defaultState();
    if (Array.isArray(parsed.deleted)) st.deleted = parsed.deleted;
    if (Array.isArray(parsed.added)) st.added = parsed.added;
    if (parsed.budgets && typeof parsed.budgets === 'object') st.budgets = parsed.budgets;
    if (parsed.goals && typeof parsed.goals === 'object') st.goals = parsed.goals;
    if (parsed.bills && typeof parsed.bills === 'object') st.bills = parsed.bills;
    if (typeof parsed.month === 'string') setCurrentMonth(parsed.month);
    return st;
  } catch {
    return defaultState();
  }
}

export function saveUserState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, month: currentMonth }));
  } catch {
    // Penyimpanan penuh atau dimatikan: situs tetap jalan, perubahan hilang.
  }
}

export function resetUserState() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Abaikan.
  }
  currentMonth = CURRENT_MONTH;
  return defaultState();
}

// Semua transaksi bulan itu: pemasukan + pengeluaran benih + tambahan user,
// dikurangi yang dihapus. Diurutkan tanggal terbaru dulu.
export function transactionsFor(month, state) {
  const rows = [];
  INCOME.filter((r) => r.month === month).forEach((r) => {
    rows.push({ id: r.id, month, date: r.date, desc: r.source, cat: null, amount: r.amount, kind: 'in' });
  });
  seedExpenses(month).forEach((r) => {
    rows.push({ id: r.id, month, date: r.date, desc: r.desc, cat: r.cat, amount: r.amount, kind: 'out' });
  });
  (state.added || []).filter((r) => r.month === month).forEach((r) => rows.push(r));
  const gone = new Set(state.deleted || []);
  return rows
    .filter((r) => !gone.has(r.id))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1));
}

export function monthSummary(month, state) {
  const txs = transactionsFor(month, state);
  const income = txs.filter((t) => t.kind === 'in').reduce((s, t) => s + t.amount, 0);
  const expense = txs.filter((t) => t.kind === 'out').reduce((s, t) => s + t.amount, 0);
  const rest = income - expense;
  const saving = Math.min(SAVINGS_TARGET, Math.max(0, rest));
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

// Baris per kategori: pagu (boleh diubah user), terpakai, sisa, rasio, status.
export function categoryRows(month, state) {
  const txs = transactionsFor(month, state);
  return CATEGORIES.map((c) => {
    const used = txs.filter((t) => t.cat === c.id).reduce((s, t) => s + t.amount, 0);
    const budget = state.budgets[c.id] != null ? state.budgets[c.id] : c.budget;
    const left = budget - used;
    const ratio = budget > 0 ? used / budget : 0;
    const status = ratio > 1 ? 'lewat' : ratio >= 0.85 ? 'hati-hati' : 'aman';
    return { ...c, budget, used, left, ratio, status };
  });
}

export function budgetTotals(month, state) {
  const rows = categoryRows(month, state);
  return {
    budget: rows.reduce((s, r) => s + r.budget, 0),
    used: rows.reduce((s, r) => s + r.used, 0),
  };
}

// Perbandingan bulan ini vs bulan sebelumnya, per kategori.
export function compareRows(month, state) {
  const prev = prevMonth(month);
  if (!prev) return null;
  const now = categoryRows(month, state);
  const old = categoryRows(prev, state);
  const rows = now.map((r) => {
    const o = old.find((x) => x.id === r.id) || { used: 0 };
    const delta = r.used - o.used;
    return {
      ...r,
      old: o.used,
      delta,
      deltaRatio: o.used > 0 ? delta / o.used : 0,
    };
  });
  return { prev, rows };
}

// Ringkasan tiap bulan (untuk grafik tren tiga bulan).
export function trendRows(state) {
  return MONTHS.map((m) => {
    const s = monthSummary(m.id, state);
    const cats = {};
    categoryRows(m.id, state).forEach((r) => {
      cats[r.id] = r.used;
    });
    return { month: m.id, short: m.short, label: m.label, income: s.income, expense: s.expense, rest: s.rest, cats };
  });
}

export function topExpenses(month, state, n) {
  return transactionsFor(month, state)
    .filter((t) => t.kind === 'out')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, n);
}

export function goalRows(state) {
  return GOALS.map((g) => {
    const saved = g.saved + (state.goals[g.id] || 0);
    const left = Math.max(0, g.target - saved);
    return { ...g, saved, left, ratio: g.target > 0 ? saved / g.target : 0 };
  });
}

export function savingsTotal(state) {
  return goalRows(state).reduce((s, g) => s + g.saved, 0);
}

// Tagihan tetap bulan ini, dengan status lunas dari state (bila diubah user).
export function billRows(state) {
  return BILLS.map((b) => {
    const paid = state.bills[b.id] != null ? state.bills[b.id] : b.paid;
    return { ...b, paid };
  }).sort((a, b) => a.due - b.due || a.name.localeCompare(b.name));
}

export function billTotals(rows) {
  const paidRows = rows.filter((r) => r.paid);
  const unpaidRows = rows.filter((r) => !r.paid);
  return {
    count: rows.length,
    paidCount: paidRows.length,
    paidSum: paidRows.reduce((s, r) => s + r.amount, 0),
    unpaidSum: unpaidRows.reduce((s, r) => s + r.amount, 0),
    total: rows.reduce((s, r) => s + r.amount, 0),
  };
}
