const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function toLocalDate(dateISO: string): Date {
  const [year, month, day] = dateISO.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayISO(): string {
  return toISODate(new Date());
}

export function diffDays(laterISO: string, earlierISO: string): number {
  const later = toLocalDate(laterISO).getTime();
  const earlier = toLocalDate(earlierISO).getTime();
  return Math.round((later - earlier) / DAY_IN_MS);
}

export function addDaysISO(dateISO: string, days: number): string {
  const date = toLocalDate(dateISO);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function getEndDateFromDuration(startDate: string, totalDays: number): string {
  return addDaysISO(startDate, Math.max(totalDays, 1) - 1);
}

export function formatDateLabel(dateISO: string, todayISO = getTodayISO()): string {
  const gap = diffDays(dateISO, todayISO);

  if (gap === 0) {
    return "Hari ini";
  }

  if (gap === -1) {
    return "Kemarin";
  }

  if (gap === 1) {
    return "Besok";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: toLocalDate(dateISO).getFullYear() === toLocalDate(todayISO).getFullYear() ? undefined : "numeric",
  }).format(toLocalDate(dateISO));
}

export function isDateInThisWeek(dateISO: string, todayISO = getTodayISO()): boolean {
  const date = toLocalDate(dateISO);
  const today = toLocalDate(todayISO);
  const mondayOffset = (today.getDay() + 6) % 7;
  const start = new Date(today);
  start.setDate(today.getDate() - mondayOffset);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return date >= start && date <= end;
}
