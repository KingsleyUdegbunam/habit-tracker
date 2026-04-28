import { it, expect, describe } from "vitest";
import { validateHabitName } from "@/lib/validators";

describe("validateHabitName", () => {
  it("returns an error when habit name is empty", () => {
    const result = validateHabitName("");
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Habit name is required");
  });

  it("returns an error when habit name exceeds 60 characters", () => {
    const result = validateHabitName("hello".repeat(62));
    expect(result.valid).toBe(false);
    expect(result.error).toBe("Habit name must be 60 characters or fewer");
  });

  it("returns a trimmed value when habit name is valid", () => {
    const result = validateHabitName("   call    mum    ");
    expect(result.valid).toBe(true);
    expect(result.value).toBe("call mum");
    expect(result.error).toBe(null);
  });
});
