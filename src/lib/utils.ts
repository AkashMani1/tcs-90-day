export function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function today(): string {
  return toDateStr(new Date());
}

export function calcStreak(dailyLogs: { date: string; completedHabits: string[]; hours?: number }[]): number {
  if (!dailyLogs.length) return 0;

  // 1. Definition of "Active": Completed habits, logged study hours, OR simply opening the app today
  const todayStr = today();
  const activeLogs = dailyLogs
    .filter((l) => (l.completedHabits && l.completedHabits.length > 0) || (l.hours && l.hours > 0) || l.date === todayStr)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (!activeLogs.length) return 0;

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = toDateStr(yesterdayDate);

  // 2. Identify where the streak currently stands
  let startIdx = 0;
  let dayOffset = 0;

  if (activeLogs[0].date === todayStr) {
    dayOffset = 0;
  } else if (activeLogs[0].date === yesterdayStr) {
    // Leeway: If today is empty, but yesterday was active, streak is still alive!
    dayOffset = 1;
  } else {
    // If they missed both today AND yesterday, streak is truly dead.
    return 0;
  }

  // 3. Count consecutive active days backwards
  let streak = 0;
  const now = new Date();

  for (let i = 0; i < activeLogs.length; i++) {
    const expectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i + dayOffset));
    const expectedStr = toDateStr(expectedDate);

    if (activeLogs[i].date === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calcTotalHours(dailyLogs: { hours: number }[]): number {
  return dailyLogs.reduce((sum, l) => sum + (l.hours || 0), 0);
}

export function calcCurrentWeek(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.min(Math.floor(diffDays / 7) + 1, 12);
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function pluralize(n: number, singular: string, plural = singular + 's'): string {
  return n === 1 ? `${n} ${singular}` : `${n} ${plural}`;
}
