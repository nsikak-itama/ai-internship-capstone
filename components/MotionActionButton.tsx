"use client";

import type { ButtonHTMLAttributes } from "react";

export type MotionActionState = "idle" | "loading" | "success" | "error";

type MotionActionButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  state: MotionActionState;
  idleLabel?: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
};

export default function MotionActionButton({
  state,
  idleLabel = "Send",
  loadingLabel = "Sending",
  successLabel = "Sent",
  errorLabel = "Error",
  className = "",
  disabled,
  ...props
}: MotionActionButtonProps) {
  const isLoading = state === "loading";

  return (
    <button
      {...props}
      type={props.type ?? "button"}
      disabled={disabled ?? isLoading}
      aria-busy={isLoading}
      className={`min-h-12 min-w-24 rounded-xl px-5 py-3 font-semibold text-white transition-[background-color,transform,opacity] duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none motion-reduce:transform-none ${
        state === "success"
          ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600"
          : state === "error"
            ? "bg-red-600 hover:bg-red-700 focus:ring-red-600"
            : "bg-gray-900 hover:bg-gray-800 focus:ring-gray-900"
      } ${className}`}
    >
      <span className="relative grid min-w-16 place-items-center">
        <span
          className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            state === "idle"
              ? "translate-y-0 opacity-100"
              : "-translate-y-1 opacity-0"
          }`}
          aria-hidden={state !== "idle"}
        >
          {idleLabel}
        </span>

        <span
          className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            isLoading
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0"
          }`}
          aria-hidden={!isLoading}
        >
          <span
            className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
            aria-hidden="true"
          />
          {loadingLabel}
        </span>

        <span
          className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            state === "success"
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0"
          }`}
          aria-hidden={state !== "success"}
        >
          <span aria-hidden="true">&#10003;</span>
          {successLabel}
        </span>

        <span
          className={`col-start-1 row-start-1 inline-flex items-center gap-2 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            state === "error"
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0"
          }`}
          aria-hidden={state !== "error"}
        >
          <span aria-hidden="true">!</span>
          {errorLabel}
        </span>
      </span>
    </button>
  );
}