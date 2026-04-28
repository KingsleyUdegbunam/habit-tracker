"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logIn } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = logIn(email, password);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Log in to continue</p>
        {error && (
          <div className=" bg-red-50 text-red-600 text-sm mb-4 p-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              placeholder="you@example.com"
              data-testid="auth-login-email"
              className="border border-gray-200 rounded-lg w-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              data-testid="auth-login-password"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            data-testid="auth-login-submit"
            className="w-full py-2.5 px-4 text-white text-sm bg-gray-900 font-medium hover:bg-gray-700 rounded-lg disabled:opacity-50 transition-colors"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
