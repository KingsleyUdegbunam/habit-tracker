import { describe, it, expect } from "vitest";
import { getHabitSlug } from "@/lib/slug";

describe("getHabitSlug", () => {
  it("returns lowercase hyphenated slug for a basic habit name", () => {
    expect(getHabitSlug("Make Breakfast")).toBe("make-breakfast");
  });

  it("trims outer spaces and collapses repeated internal spaces", () => {
    expect(getHabitSlug(" Call  mum ")).toBe("call-mum");
  });

  it("removes non alphanumeric characters except hyphens", () => {
    expect(getHabitSlug("Wake up @7-AM!")).toBe("wake-up-7-am");
  });
});
