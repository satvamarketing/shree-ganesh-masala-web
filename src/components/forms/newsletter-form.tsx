"use client";

import { Honeypot } from "@/components/forms/field";
import { useFormPost } from "@/lib/use-form-post";

export function NewsletterForm() {
  const { state, error, submit } = useFormPost("/api/subscribe");

  if (state === "sent") {
    return (
      <p className="font-serif text-xl text-ink">
        Thanks, you&apos;re on the list.
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        void submit(Object.fromEntries(data.entries()));
      }}
      className="mx-auto flex max-w-[520px] flex-col items-center gap-2.5"
    >
      <div className="flex w-full flex-wrap justify-center gap-2.5">
        <label htmlFor="newsletter-email" className="sr-only-label">
          Your email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="box-border min-w-[240px] flex-1 rounded-full border-[1.5px] border-[#CBDDC4] bg-white px-6 py-4 text-base text-ink outline-none focus:border-ink"
        />
        <Honeypot />
        <button
          type="submit"
          disabled={state === "sending"}
          className="cursor-pointer rounded-full bg-red px-8 py-4 text-[15.5px] font-bold text-white transition-colors hover:bg-ink disabled:cursor-wait disabled:opacity-70"
        >
          {state === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="text-[14px] font-semibold text-red">
          {error}
        </p>
      ) : null}
    </form>
  );
}
