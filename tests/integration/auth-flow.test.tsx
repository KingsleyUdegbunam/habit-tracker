import { it, describe, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

// next/navigation mock
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
}));

beforeEach(() => {
  localStorage.clear();
  mockPush.mockClear();
});

describe("auth flow", () => {
  it("submits the signup form and creates a session", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(
      screen.getByTestId("auth-signup-email"),
      "test@example.com",
    );
    await user.type(screen.getByTestId("auth-signup-password"), "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      const session = JSON.parse(
        localStorage.getItem("habit-tracker-session") ?? "null",
      );
      expect(session).not.toBeNull();
      expect(session.email).toBe("test@example.com");
    });

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for duplicate signup email", async () => {
    const user = userEvent.setup();

    render(<SignupForm />);

    const emailInput = screen.getByTestId("auth-signup-email");
    const passwordInput = screen.getByTestId("auth-signup-password");

    //Signup 1

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    // clear inputs
    await user.clear(emailInput);
    await user.clear(passwordInput);

    //Signup 2(Reenter value).
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(screen.getByTestId("auth-signup-submit"));

    expect(await screen.findByText("User already exists")).toBeInTheDocument();
  });

  it("submits the login form and stores the active session", async () => {
    const user = userEvent.setup();

    const { signUp } = await import("@/lib/auth");
    signUp("login@example.com", "password123");

    render(<LoginForm />);
    await user.type(
      screen.getByTestId("auth-login-email"),
      "login@example.com",
    );
    await user.type(screen.getByTestId("auth-login-password"), "password123");
    await user.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      const session = JSON.parse(
        localStorage.getItem("habit-tracker-session") ?? "null",
      );
      expect(session).not.toBeNull();
      expect(session.email).toBe("login@example.com");
    });

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error for invalid login credentials", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(
      screen.getByTestId("auth-login-email"),
      "wrong@example.com",
    );
    await user.type(screen.getByTestId("auth-login-password"), "wrongpassword");
    await user.click(screen.getByTestId("auth-login-submit"));

    expect(
      await screen.findByText("Invalid email or password"),
    ).toBeInTheDocument();
  });
});
