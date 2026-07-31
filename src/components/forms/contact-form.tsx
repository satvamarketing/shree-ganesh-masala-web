"use client";

import { Field, Honeypot } from "@/components/forms/field";
import { useFormPost } from "@/lib/use-form-post";

export function ContactForm() {
  const { state, error, submit, reset } = useFormPost("/api/contact");

  if (state === "sent") {
    return (
      <div className="px-2.5 py-10 text-center">
        <div className="mb-4 text-[46px] leading-none text-forest" aria-hidden="true">
          ✓
        </div>
        <h2 className="mb-3 font-serif text-[30px] font-normal text-ink">
          Message sent
        </h2>
        <p className="mb-6 text-base leading-[1.65] text-body">
          Thanks — we&apos;ll get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-full bg-red px-6.5 py-3.5 text-[14.5px] font-bold text-white hover:bg-red-dark"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-5.5 font-serif text-[clamp(26px,3vw,34px)] font-normal text-ink">
        Send us a message
      </h2>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          void submit(Object.fromEntries(data.entries()));
        }}
        className="grid gap-3.5"
      >
        <Field name="name" label="Your name" required tone="cream" />
        <Field name="email" label="Email" type="email" required tone="cream" />
        <Field name="subject" label="Subject" required tone="cream" />
        <Field name="message" label="How can we help?" rows={6} required tone="cream" />
        <Honeypot />

        {error ? (
          <p role="alert" className="text-[14px] font-semibold text-red">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={state === "sending"}
          className="cursor-pointer rounded-full bg-red px-7 py-4.5 text-base font-bold text-white transition-colors hover:bg-forest disabled:cursor-wait disabled:opacity-70"
        >
          {state === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
