export const TODAY = "2026-09-22";
export const MONTH = "2026-09";
export const PREVIOUS_MONTH = "2026-08";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatInr(value: number, options?: { sign?: boolean; hidden?: boolean }): string {
  if (options?.hidden) return "₹••••";
  const rounded = Math.round(value);
  const digits = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.abs(rounded));
  const sign = rounded < 0 ? "−" : options?.sign && rounded > 0 ? "+" : "";
  return `${sign}₹${digits}`;
}

export function formatPercent(value: number): string {
  return Number.isFinite(value) ? `${Math.round(value)}%` : "0%";
}

export function addDays(iso: string, days: number): string {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function dayDiff(from: string, to: string): number {
  const a = Date.parse(`${from.slice(0, 10)}T00:00:00Z`);
  const b = Date.parse(`${to.slice(0, 10)}T00:00:00Z`);
  return Math.round((b - a) / 86400000);
}

export function monthTitle(month: string): string {
  const [year, m] = month.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${year}`;
}

export function shortDate(iso: string): string {
  const [, month, day] = iso.slice(0, 10).split("-").map(Number);
  return `${day} ${SHORT[(month ?? 1) - 1]}`;
}

export function longDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return `${day} ${SHORT[(month ?? 1) - 1]} ${year}`;
}

export function relativeDay(iso: string): string {
  if (iso.slice(0, 10) === TODAY) return "Today";
  if (iso.slice(0, 10) === addDays(TODAY, -1)) return "Yesterday";
  return longDate(iso);
}

export function dueLabel(iso: string): string {
  const days = dayDiff(TODAY, iso);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days > 1) return `In ${days} days`;
  if (days === -1) return "1 day overdue";
  return `${Math.abs(days)} days overdue`;
}

export function clockTime(iso: string): string {
  const match = iso.match(/T(\d{2}):(\d{2})/);
  if (!match) return "";
  let hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? "pm" : "am";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}

export function oneDecimal(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function destinationLabel(value?: string): string | null {
  if (value === "emergency") return "Emergency";
  if (value === "goal") return "Goal";
  if (value === "investment") return "Investment";
  return null;
}
