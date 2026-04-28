import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import { Habit } from "@/types/habit";

const testHabit: Habit = {
  id: "0",
  userId: "user-0",
  name: "Call Mum",
  description: "first thing in the morning",
  frequency: "daily",
  createdAt: "2026-08-28T00:00:00.000Z",
  completions: [],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const habit = { ...testHabit };
    const result = toggleHabitCompletion(habit, "2026-08-28");
    expect(result.completions).toContain("2026-08-28");
  });

  it("removes a completion date when the date already exists", () => {
    const habit = { ...testHabit, completions: ["2026-08-28"] };
    const result = toggleHabitCompletion(habit, "2026-08-28");
    expect(result.completions).not.toContain("2026-08-28");
  });

  it("does not mutate the original habit object", () => {
    const habit = { ...testHabit, completions: ["2026-08-28"] };

    const copy = structuredClone(habit);
    const updated = toggleHabitCompletion(habit, "2026-08-28");

    expect(habit).toEqual(copy);
    expect(habit).not.toBe(updated);
    expect(updated.completions).not.toContain("2026-08-28");
  });
});
