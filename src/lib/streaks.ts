export function toDateString(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  const now = new Date();
  const todayDate = today ?? toDateString(now);

  const completedSet = new Set(completions);

  if (!completedSet.has(todayDate)) return 0;

  //count consecutive days backward from today
  let streak = 0;
  const current = new Date(todayDate);

  while (true) {
    const dateString = toDateString(current);

    if (!completedSet.has(dateString)) break;

    streak++;
    current.setDate(current.getDate() - 1);
  }
  return streak;
}
