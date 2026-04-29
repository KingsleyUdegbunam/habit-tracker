import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HabitList from "@/components/habits/HabitList";
import { saveSession } from "@/lib/storage";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

beforeEach(() => {
  localStorage.clear();
  saveSession({ userId: "test-user", email: "test@example.com" });
});

describe("habit form", () => {
  it("shows a validation error when habit name is empty", async () => {
    const user = userEvent.setup();
    render(<HabitList />);

    await user.click(screen.getByTestId("create-habit-button"));
    await user.click(screen.getByTestId("habit-save-button"));

    expect(
      await screen.findByText("Habit name is required"),
    ).toBeInTheDocument();
  });

  it("creates a new habit and renders it in the list", async () => {
    const user = userEvent.setup();
    render(<HabitList />);

    await user.click(screen.getByTestId("create-habit-button"));
    await user.type(screen.getByTestId("habit-name-input"), "go for a run");
    await user.click(screen.getByTestId("habit-save-button"));

    expect(
      await screen.findByTestId("habit-card-go-for-a-run"),
    ).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    const user = userEvent.setup();
    render(<HabitList />);

    // Create habit first
    await user.click(screen.getByTestId("create-habit-button"));
    await user.type(screen.getByTestId("habit-name-input"), "go for a run");
    await user.click(screen.getByTestId("habit-save-button"));

    // Open edit
    const editButton = await screen.findByTestId("habit-edit-go-for-a-run");
    await user.click(editButton);

    // Update name
    const nameInput = screen.getByTestId("habit-name-input");
    await user.clear(nameInput);
    await user.type(nameInput, "Read a book");
    await user.click(screen.getByTestId("habit-save-button"));

    // Assertions
    expect(
      await screen.findByTestId("habit-card-read-a-book"),
    ).toBeInTheDocument();

    expect(screen.queryByTestId("habit-card-go-for-a-run")).toBeNull();
  });

  it("deletes a habit only after explicit confirmation", async () => {
    const user = userEvent.setup();
    render(<HabitList />);

    // Create habit
    await user.click(screen.getByTestId("create-habit-button"));
    await user.type(screen.getByTestId("habit-name-input"), "go for a run");
    await user.click(screen.getByTestId("habit-save-button"));

    // Open delete flow
    const deleteButton = await screen.findByTestId("habit-delete-go-for-a-run");
    await user.click(deleteButton);

    // Confirm modal appearance
    const confirmBtn = await screen.findByTestId("confirm-delete-button");
    await user.click(confirmBtn);

    // Assert removal
    expect(screen.queryByTestId("habit-card-go-for-a-run")).toBeNull();
  });

  it("toggles completion and updates the streak display", async () => {
    const user = userEvent.setup();
    render(<HabitList />);

    // Create habit
    await user.click(screen.getByTestId("create-habit-button"));
    await user.type(screen.getByTestId("habit-name-input"), "go for a run");
    await user.click(screen.getByTestId("habit-save-button"));

    // Toggle completion
    const toggleBtn = await screen.findByTestId("habit-complete-go-for-a-run");
    await user.click(toggleBtn);

    // Assert streak update
    const streak = await screen.findByTestId("habit-streak-go-for-a-run");
    expect(streak.textContent).toContain("1");
  });
});
