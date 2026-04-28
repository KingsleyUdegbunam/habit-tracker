"use client";

import { useState, useEffect } from "react";
import { Habit } from "@/types/habit";
import { getHabits, saveHabits, getSession } from "@/lib/storage";
import { toggleHabitCompletion } from "@/lib/habits";
import HabitCard from "./HabitCard";
import HabitForm from "./HabitForm";
import { v4 as uuidv4 } from "uuid";
import { toDateString } from "@/lib/streaks";

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) return;

    const allHabits = getHabits();
    const userHabits = allHabits.filter((h) => h.userId === session.userId);
    setHabits(userHabits);
  }, []);

  function persistHabits(updated: Habit[]) {
    const session = getSession();
    if (!session) return;
    const allHabits = getHabits();
    const othersHabits = allHabits.filter((h) => h.userId !== session.userId);

    saveHabits([...othersHabits, ...updated]);
    setHabits(updated);
  }

  function handleCreate(name: string, description: string) {
    const session = getSession();
    if (!session) return;

    const newHabit: Habit = {
      id: uuidv4(),
      userId: session.userId,
      name,
      description,
      frequency: "daily",
      createdAt: new Date().toISOString(),
      completions: [],
    };

    persistHabits([...habits, newHabit]);
    setShowForm(false);
  }

  function handleEdit(name: string, description: string) {
    if (!editingHabit) return;

    const updated = habits.map((h) =>
      h.id === editingHabit.id ? { ...h, name, description } : h,
    );
    persistHabits(updated);
    setEditingHabit(null);
  }
  function handleDelete() {
    if (!deletingHabit) return;
    const updated = habits.filter((h) => h.id !== deletingHabit.id);
    persistHabits(updated);
    setDeletingHabit(null);
  }

  function handleComplete(habit: Habit) {
    const todayString = toDateString(new Date());

    const updated = habits.map((h) =>
      h.id === habit.id ? toggleHabitCompletion(h, todayString) : h,
    );

    persistHabits(updated);
  }

  return (
    <div>
      {/* Create button */}
      {!showForm && !editingHabit && (
        <button
          data-testid="create-habit-button"
          onClick={() => setShowForm(true)}
          className="mb-6 w-full py-2.5 px-4 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-700 transition-colors"
        >
          + New Habit
        </button>
      )}

      {/* Create form */}
      {showForm && (
        <div className="mb-6">
          <HabitForm
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Empty state */}
      {habits.length === 0 && !showForm && (
        <div
          data-testid="empty-state"
          className="text-center py-16 text-gray-400"
        >
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-sm font-medium">No habits yet</p>
          <p className="text-sm">Click &quot;New Habit&quot; to get started</p>
        </div>
      )}

      {/* Habit cards */}
      <div className="space-y-4">
        {habits.map((habit) =>
          editingHabit?.id === habit.id ? (
            <HabitForm
              key={habit.id}
              initialValues={{
                name: habit.name,
                description: habit.description,
              }}
              onSave={handleEdit}
              onCancel={() => setEditingHabit(null)}
            />
          ) : (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={handleComplete}
              onEdit={() => setEditingHabit(habit)}
              onDelete={() => setDeletingHabit(habit)}
            />
          ),
        )}
      </div>

      {/* Delete confirmation */}
      {deletingHabit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Delete habit
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete &quot;{deletingHabit.name}
              &quot;? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingHabit(null)}
                className="flex-1 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                data-testid="confirm-delete-button"
                onClick={handleDelete}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
