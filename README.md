# 🧠 Habit Tracker
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Tests](https://img.shields.io/badge/Tests-Vitest%20%7C%20Playwright-brightgreen)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple)
![License](https://img.shields.io/badge/License-MIT-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-success)
## 📌 Project Overview

A lightweight habit tracking application built with Next.js that enables users to create habits, track daily completion, and maintain streaks.

**The application is offline-first and uses localStorage for persistence**, with optional PWA support for installable mobile-like experience.

---

## ⚙️ Setup Instructions

```bash id="setup2"
git clone git@github.com:KingsleyUdegbunam/habit-tracker.git
cd habit-tracker
npm install
npx playwright install
```

* * * * *

▶️ Run Instructions
-------------------

### Development

```
npm run dev
```

### Production

```
npm run build
npm run start
```

* * * * *

🧪 Test Instructions
--------------------

### Run all tests

```
npm run test
```

### Unit tests

```
npm run test:unit
```

### Integration tests

```
npm run test:integration
```

### End-to-end tests

```
npm run test:e2e
```

* * * * *

💾 Local Persistence Structure
------------------------------

The application uses **localStorage as its persistence layer**, abstracted through a centralized utility.

### Storage Layer Location

```
src/lib/storage.ts
```

### Storage Keys

Defined in:

```
src/lib/constants.ts
```

-   `USERS` → user data
-   `SESSION` → authentication session
-   `HABITS` → habit tracking data

### Design Details

-   SSR-safe checks using `typeof window !== "undefined"`
-   Safe JSON parsing via `safeParse`
-   Centralized access to all storage operations
-   Defensive fallback handling for corrupted storage data

* * * * *

📱 PWA Implementation
---------------------

PWA support is implemented using a **service worker-based caching strategy**.

### Key Components

-   Service Worker:

```
/public/sw.js
```

-   Registration:

```
ServiceWorkerRegister.tsx
```

### Implementation Details

-   Service worker registered on client mount
-   Static assets cached for offline usage
-   App remains functional without internet connection
-   Improves repeat load performance
-   Enables installable mobile-like experience

* * * * *

⚖️ Trade-offs / Limitations
---------------------------

-   No backend database (uses localStorage only)
-   No real authentication system (session is simulated)
-   Data is device/browser-specific
-   No cross-device synchronization
-   PWA caching requires manual update strategy
-   Limited scalability due to client-side persistence

* * * * *

## 🧪 Test File → Behavior Mapping

This section maps every test file in the repository to the exact behavior it verifies.

---

## 🟦 End-to-End Tests

### `tests/e2e/app.spec.ts`

**Behavior Verified: Full application behavior in real browser environment**

- User authentication flow (signup, login, logout)
- Route protection (/ → /dashboard → /login)
- Habit creation and display in UI
- Habit completion and streak updates
- Data persistence after page reload
- Offline behavior and cached app shell via PWA service worker
- Splash screen rendering behavior
- Session persistence across reloads

---

## 🟨 Integration Tests

### `tests/integration/auth-flow.test.tsx`

**Behavior Verified: Authentication + session system integration**

- User signup creates valid session in localStorage
- Duplicate signup email handling
- Login authenticates existing users
- Invalid credentials show proper errors
- Session persistence after login
- Router navigation after authentication

---

### `tests/integration/habit-form.test.tsx`

**Behavior Verified: Habit CRUD flow in UI + storage integration**

- Validation prevents empty habit creation
- Habit creation renders correctly in UI
- Habit editing updates name while preserving data integrity
- Habit deletion requires confirmation
- Habit completion toggles state correctly
- Streak updates after completion

---

## 🟩 Unit Tests

### `tests/unit/habits.test.ts`

**Behavior Verified: Core habit mutation logic**

- Habit completion toggling adds/removes dates
- Ensures immutability of habit objects
- Prevents direct state mutation

---

### `tests/unit/slug.test.ts`

**Behavior Verified: URL slug generation utility**

- Converts habit names to URL-friendly slugs
- Removes special characters
- Normalizes whitespace
- Handles casing and formatting rules

---

### `tests/unit/streaks.test.ts`

**Behavior Verified: Streak calculation algorithm**

- Calculates correct consecutive day streaks
- Handles empty completion arrays
- Ignores duplicate entries
- Breaks streak when days are missed

---

### `tests/unit/validators.test.ts`

**Behavior Verified: Input validation rules**

- Rejects empty habit names
- Enforces character limit (≤ 60 chars)
- Returns trimmed and normalized values
- Returns structured validation errors

---

## 🧠 Summary

### Test Layer Responsibilities

- **Unit Tests →** Pure logic (streaks, validation, slug, mutations)
- **Integration Tests →** Feature workflows (auth + habit UI + storage)
- **E2E Tests →** Full user journey in real browser environment

---

## 🏁 Coverage Statement

This test suite validates:

- Authentication system integrity
- Habit lifecycle correctness
- State persistence via localStorage
- UI behavior consistency
- End-to-end user flows
- Offline/PWA behavior reliability

## 📄 Technical Requirement

This project is implemented in strict accordance with the provided [technical requirements document.](https://docs.google.com/document/d/1Gp2_0pZWWnQbLc6zLS1U4wI6kO8DCC07Ea5JFjOYXlI/edit?tab=t.0) 

## Live Demo
[🔗 Click here](https://habit-mate.netlify.app/)