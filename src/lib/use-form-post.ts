"use client";

import { useState } from "react";

export type FormState = "idle" | "sending" | "sent" | "error";

/**
 * Posts a JSON payload to one of the form endpoints and tracks the result.
 * Never clears the caller's field values — a failed submission must not lose
 * what the user typed.
 */
export function useFormPost(endpoint: string) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: Record<string, unknown>): Promise<boolean> {
    setState("sending");
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("error");
        return false;
      }
      setState("sent");
      return true;
    } catch {
      setError("Could not reach the server. Please check your connection.");
      setState("error");
      return false;
    }
  }

  return {
    state,
    error,
    submit,
    reset: () => {
      setState("idle");
      setError(null);
    },
  };
}
