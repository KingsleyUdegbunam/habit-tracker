"use client";

import { Habit } from "@/types/habit";
import { getHabitSlug } from "@/lib/slug";
import { calculateCurrentStreak, toDateString } from "@/lib/streaks";

type HabitCardProps = {
  habit: Habit;
  onComplete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
};

export default function HabitCard({
  habit,
  onComplete,
  onEdit,
  onDelete,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name);
  const todayString = toDateString(new Date());

  const isCompletedToday = habit.completions.includes(todayString);
  const streak = calculateCurrentStreak(habit.completions);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`border rounded-2xl p-5 shadow-sm transition-all ${
        isCompletedToday
          ? "border-green-200 bg-green-50"
          : "border-gray-100 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {habit.description}
            </p>
          )}
          <div
            data-testid={`habit-streak-${slug}`}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-orange-500"
          >
            🔥 {streak} day{streak !== 1 ? "s" : ""} streak
          </div>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onComplete(habit)}
          aria-label={isCompletedToday ? "Mark incomplete" : "Mark complete"}
          aria-pressed={isCompletedToday}
          className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
            isCompletedToday
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-400"
          }`}
        >
          {isCompletedToday ? "✓" : ""}
        </button>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="flex-1 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => onDelete(habit)}
          className="flex-1 py-1.5 text-sm font-medium text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
