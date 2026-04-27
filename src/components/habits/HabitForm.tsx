"use client";

import { useState } from "react";
import { validateHabitName } from "@/lib/validators";
import { Habit } from "@/types/habit";

type HabitFormProps = {
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
  initialValues?: Pick<Habit, "name" | "description">;
};

export default function HabitForm({
  onSave,
  onCancel,
  initialValues,
}: HabitFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    onSave(validation.value, description.trim());
  }

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
      data-testid="habit-form"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {initialValues ? "Edit habit" : "New habit"}
      </h2>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm mb-4 p-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="habit-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            placeholder="e.g. Go for a Walk"
            type="text"
            name="habit-name"
            id="habit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="habit-name-input"
            className="border border-gray-200 rounded-lg w-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="habit-description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            name="habit-description"
            id="habit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Step out by 7 A.M."
            data-testid="habit-description-input"
            className="border border-gray-200 rounded-lg w-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label
            htmlFor="habit-frequency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Frequency
          </label>
          <select
            name="habit-frequency"
            id="habit-frequency"
            defaultValue="daily"
            data-testid="habit-frequency-select"
            className="border border-gray-200 rounded-lg w-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="daily">Daily</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="habit-save-button"
            className="flex-1 py-2.5 px-4 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
