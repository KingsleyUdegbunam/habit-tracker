import { it, expect, describe } from "vitest";
import { calculateCurrentStreak } from "@/lib/streaks";

describe("calculateCurrentStreak", () => {
  const today = "2026-08-28";
  const yesterday = "2026-08-27";
  const twoDaysBack = "2026-08-26";
  const threeDaysBack = "2026-08-25";

  it("returns 0 when completions is empty", () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it("returns 0 when today is not completed", () => {
    expect(calculateCurrentStreak([twoDaysBack, yesterday], today)).toBe(0);
  });

  it("returns the correct streak for consecutive completed days", () => {
    expect(
      calculateCurrentStreak(
        [threeDaysBack, twoDaysBack, yesterday, today],
        today,
      ),
    ).toBe(4);
  });

  it("ignores duplicate completion dates", () => {
    expect(
      calculateCurrentStreak(
        [
          threeDaysBack,
          threeDaysBack,
          twoDaysBack,
          twoDaysBack,
          yesterday,
          today,
          today,
        ],
        today,
      ),
    ).toBe(4);
  });
});
