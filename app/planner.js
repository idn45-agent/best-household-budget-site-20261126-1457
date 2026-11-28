// Perencana v3 — dua alat baru DompetKita:
// (a) Sisa Aman Harian: sisa pagu tiap kategori dibagi hari tersisa bulan ini.
// (b) Simulasi Tabungan: berapa bulan sampai tiap tujuan lunas bila menyisihkan
//     jumlah tertentu per bulan, lengkap dengan bulan selesainya.

import { DAYS_LEFT_IN_MONTH, DATA_THROUGH } from './data.js';
import { categoryRows, goalRows } from './store.js';

export const DAYS_LEFT = DAYS_LEFT_IN_MONTH;
export const DATA_AS_OF = DATA_THROUGH;

// Sisa aman harian satu kategori: {cat, budget, used, remaining, perDay, daysLeft, status}
// status: 'lebih' (pagu sudah lewat), 'pas' (sisa 0), 'aman' (masih ada sisa).
export function dailySafe(catId, month, state) {
  const row = categoryRows(month, state).find((r) => r.id === catId);
  if (!row) return null;
  const remaining = row.left;
  return {
    cat: row,
    budget: row.budget,
    used: row.used,
    remaining,
    perDay: remaining > 0 ? Math.floor(remaining / DAYS_LEFT) : 0,
    daysLeft: DAYS_LEFT,
    status: remaining < 0 ? 'lebih' : remaining === 0 ? 'pas' : 'aman',
  };
}

// Semua kategori diurutkan dari yang paling mepet (sisa terkecil dulu).
export function dailySafeAll(month, state) {
  return categoryRows(month, state)
    .map((r) => dailySafe(r.id, month, state))
    .sort((a, b) => a.remaining - b.remaining);
}

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// Bulan berjalan (2026-11) ditambah n bulan, dalam format "Mei 2027".
export function monthLabelAfter(n) {
  const baseYear = 2026;
  const baseMonth = 11; // November
  const total = (baseYear * 12 + (baseMonth - 1)) + n;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  return NAMA_BULAN[month - 1] + ' ' + year;
}

// Simulasi satu tujuan: berapa bulan sampai lunas dengan setoran per bulan.
export function simulateGoal(goalId, monthly, state) {
  const goal = goalRows(state).find((g) => g.id === goalId);
  if (!goal) return null;
  const perMonth = Math.max(0, Math.floor(Number(monthly) || 0));
  if (goal.left <= 0) return { goal, monthly: perMonth, months: 0, finish: 'Sudah lunas', done: true };
  if (perMonth <= 0) return { goal, monthly: perMonth, months: null, finish: '—', done: false };
  const months = Math.ceil(goal.left / perMonth);
  return { goal, monthly: perMonth, months, finish: monthLabelAfter(months), done: false };
}

// Simulasi semua tujuan dengan satu jumlah setoran per bulan.
export function goalTimeline(monthly, state) {
  return goalRows(state).map((g) => simulateGoal(g.id, monthly, state));
}
