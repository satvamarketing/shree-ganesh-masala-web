"use client";

import { Field, Honeypot } from "@/components/forms/field";
import { useFormPost } from "@/lib/use-form-post";

const FIELDS = [
  { name: "business", label: "Business name", required: true },
  { name: "abn", label: "ABN", required: true },
  { name: "contact", label: "Contact name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", type: "tel", required: true },
  { name: "suburb", label: "Delivery suburb & postcode", required: true },
] as const;

export function WholesaleForm() {
  const { state, error, submit, reset } = useFormPost("/api/wholesale");

  if (state === "sent") {
    return (
      <div className="px-2.5 py-10 text-center">
        <div className="mb-4 text-[46px] leading-none" aria-hidden="true">
          ✓
        </div>
        <h2 className="mb-3 font-serif text-[32px] font-normal">
          Application received
        </h2>
        <p className="mb-6 text-base leading-[1.65] text-[#F2F7EF]/85">
          We&apos;ll review it and come back to you within one business day with
          your pricing login.
        </p>
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-full bg-gold px-6.5 py-3.5 text-[14.5px] font-bold text-ink hover:bg-white"
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2.5 font-serif text-[clamp(26px,3vw,36px)] leading-[1.1] font-normal">
        Open a wholesale account
      </h2>
      <p className="mb-6.5 text-[15px] leading-[1.6] text-[#F2F7EF]/80">
        Takes about two minutes.
      </p>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          void submit(Object.fromEntries(data.entries()));
        }}
        className="grid gap-3.5"
      >
        {FIELDS.map((f) => (
          <Field key={f.name} {...f} tone="forest" />
        ))}
        <Field
          name="notes"
          label="What are you looking to stock?"
          rows={3}
          tone="forest"
        />
        <Honeypot />

        {error ? (
          <p role="alert" className="text-[14px] font-semibold text-[#FBD9DB]">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={state === "sending"}
          className="mt-1 cursor-pointer rounded-full bg-gold px-7 py-4.5 text-base font-bold text-ink transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-70"
        >
          {state === "sending" ? "Sending…" : "Submit application"}
        </button>
        <p className="text-center text-[12.5px] text-[#F2F7EF]/60">
          We&apos;ll only use these details to set up your account.
        </p>
      </form>
    </div>
  );
}
