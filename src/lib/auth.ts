import { v4 as uuidv4 } from "uuid";
import { getUsers, saveUsers, saveSession, clearSession } from "@/lib/storage";

export function SigUp(
  email: string,
  password: string,
): {
  success: boolean;
  error: string | null;
} {
  const users = getUsers();
  const exists = users.find((user) => user.email === email);

  if (exists) {
    return {
      success: false,
      error: "User already exists",
    };
  }
  const newUser = {
    id: uuidv4(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);
  saveSession({ userId: newUser.id, email: newUser.email });
  return { success: true, error: null };
}

export function logIn(
  email: string,
  password: string,
): { success: boolean; error: string | null } {
  const users = getUsers();

  const user = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (!user) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }
  saveSession({ userId: user.id, email: user.email });
  return { success: true, error: null };
}

export function logOut(): void {
  clearSession();
}
