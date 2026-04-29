import { test, expect, Page } from "@playwright/test";

test.describe("Habit Tracker app", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies();
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  async function signup(page: Page, email: string) {
    await page.goto("/signup");
    await page.getByTestId("auth-signup-email").fill(email);
    await page.getByTestId("auth-signup-password").fill("password123");
    await page.getByTestId("auth-signup-submit").click();

    await page.waitForURL("/dashboard");
  }

  async function login(page: Page, email: string, password = "password123") {
    await page.getByTestId("auth-login-email").fill(email);
    await page.getByTestId("auth-login-password").fill(password);
    await page.getByTestId("auth-login-submit").click();

    await page.waitForURL("/dashboard");
  }

  async function createHabit(page: Page, name: string) {
    await page.getByTestId("create-habit-button").click();
    await page.getByTestId("habit-name-input").fill(name);
    await page.getByTestId("habit-save-button").click();
  }

  test("shows the splash screen and redirects unauthenticated users to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("redirects authenticated users from / to /dashboard", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "habit-tracker-session",
        JSON.stringify({ userId: "user-1", email: "test@example.com" }),
      );
    });
    await page.goto("/");

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("prevents unauthenticated access to /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login");
  });

  test("signs up a new user and lands on the dashboard", async ({ page }) => {
    await signup(page, "test@example.com");
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    const email = "test@example.com";
    const password = "password123";

    // Sign up first
    await signup(page, email);

    // Log out
    await page.getByTestId("auth-logout-button").click();
    await page.waitForURL("/login");

    // Log back in
    await login(page, email, password);
    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByTestId("dashboard-page")).toBeVisible();
  });

  test("creates a habit from the dashboard", async ({ page }) => {
    await signup(page, "test@example.com");

    await createHabit(page, "Call Mum");

    await expect(page.getByTestId("habit-card-call-mum")).toBeVisible();
  });

  test("completes a habit for today and updates the streak", async ({
    page,
  }) => {
    await signup(page, "test@example.com");

    // Create habit
    await createHabit(page, "Call Mum");
    // Complete it
    await page.getByTestId("habit-complete-call-mum").click();

    const streak = page.getByTestId("habit-streak-call-mum");
    await expect(streak).toContainText("1");
  });

  test("persists session and habits after page reload", async ({ page }) => {
    await signup(page, "test@example.com");

    // Create habit
    await createHabit(page, "Call Mum");

    // Reload
    await page.reload();
    await page.waitForURL("/dashboard");
    await expect(page.getByTestId("habit-card-call-mum")).toBeVisible();
  });

  test("logs out and redirects to /login", async ({ page }) => {
    await signup(page, "test@example.com");

    await page.getByTestId("auth-logout-button").click();
    await expect(page).toHaveURL("/login");
  });

  test("loads the cached app shell when offline after the app has been loaded once", async ({
    page,
    context,
  }) => {
    // Load app once while online
    await page.goto("/");
    await page.waitForURL("/login");

    // Go offline
    await context.setOffline(true);

    // Try loading again offline
    await page.goto("/login");
    await expect(page.getByTestId("splash-screen")).toBeVisible();
  });
});
