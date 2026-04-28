"use client";

import { useRouter } from "next/navigation";
import { logOut } from "@/lib/auth";
import { getSession } from "@/lib/storage";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import HabitList from "@/components/habits/HabitList";

export default function DashboardPage() {
  const router = useRouter();
  const session = getSession();

  function handleLogout() {
    logOut();
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold text-gray-900">
                Habit Tracker
              </h1>
              <p className="text-xs text-gray-500">{session?.email}</p>
            </div>
            <button
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-lg mx-auto px-4 py-6">
          <HabitList />
        </main>
      </div>
    </ProtectedRoute>
  );
}
