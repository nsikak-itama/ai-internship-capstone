"use client";

export default function ChatError({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <section
        role="alert"
        className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm"
      >
        <h1 className="text-lg font-semibold text-gray-900">
          The chat could not load
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          Something unexpected happened while loading this page. Try again
          to return to the qualification chat.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          Try again
        </button>
      </section>
    </main>
  );
}