import { User, Session } from "@/types/auth";
import { Habit } from "@/types/habit";
import { STORAGE_KEYS } from "./constants";

const isBrowser = typeof window !== "undefined";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
// Users
export function getUsers(): User[] {
  if (!isBrowser) return [];
  return safeParse(localStorage.getItem(STORAGE_KEYS.USERS), []);
}

export function saveUsers(users: User[]): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// Session
export function getSession(): Session | null {
  if (!isBrowser) return null;
  return safeParse(localStorage.getItem(STORAGE_KEYS.SESSION), null);
}

export function saveSession(session: Session | null): void {
  if (!isBrowser) return;
  if (!session) {
    clearSession();
    return;
  }
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// Habits
export function getHabits(): Habit[] {
  if (!isBrowser) return [];
  return safeParse(localStorage.getItem(STORAGE_KEYS.HABITS), []);
}

export function saveHabits(habits: Habit[]): void {
  if (!isBrowser) return;
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}
