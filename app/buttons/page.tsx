"use client";

import { useEffect, useRef, useState } from "react";
import MotionActionButton, {
  type MotionActionState,
} from "../../components/MotionActionButton";

export default function ButtonsPage() {
  const [state, setState] = useState<MotionActionState>("idle");
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const runDemo = (result: "success" | "error") => {
    if (state === "loading") {
      return;
    }

    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    setState("loading");

    resetTimeoutRef.current = setTimeout(() => {
      setState(result);

      resetTimeoutRef.current = setTimeout(() => {
        setState("idle");
      }, result === "success" ? 900 : 1400);
    }, 900);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-12 sm:px-6">
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Week 6 — Assignment 1
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Motion Button Demo
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            This demo shows an interruptible button lifecycle from idle to
            loading, then success or error, before returning to idle.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start gap-4">
          <MotionActionButton
            state={state}
            onClick={() => runDemo("success")}
            aria-label="Run successful button transition"
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => runDemo("success")}
              disabled={state === "loading"}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trigger success
            </button>

            <button
              type="button"
              onClick={() => runDemo("error")}
              disabled={state === "loading"}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trigger failure
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h2 className="font-semibold text-gray-900">Current state</h2>
          <p className="mt-1 text-sm text-gray-600">
            {state === "idle" && "Idle — ready for interaction."}
            {state === "loading" && "Loading — processing the action."}
            {state === "success" && "Success — action completed."}
            {state === "error" && "Error — action failed."}
          </p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="font-semibold text-gray-900">
            Motion implementation
          </h2>

          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>
              <strong>200ms ease-out:</strong> keeps transitions responsive
              while avoiding an abrupt state change.
            </li>
            <li>
              <strong>Opacity and transform:</strong> keep the animated
              properties compositor-friendly and avoid layout reflow.
            </li>
            <li>
              <strong>Press feedback:</strong> a small active scale gives
              immediate feedback when the button is pressed.
            </li>
            <li>
              <strong>Reduced motion:</strong> animation is removed when the
              user prefers reduced motion while the state feedback remains.
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}