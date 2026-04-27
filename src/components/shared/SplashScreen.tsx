export default function SplashScreen() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white"
      data-testid="splash-screen"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Habit Tracker</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Small actions. Remarkable results.
        </p>
      </div>
    </div>
  );
}
