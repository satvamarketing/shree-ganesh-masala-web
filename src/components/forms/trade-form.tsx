"use client";

import { Honeypot } from "@/components/forms/field";
import { useFormPost } from "@/lib/use-form-post";
import { BUSINESS_TYPES } from "@/app/api/wholesale/route";

const FIELD =
  "w-full box-border rounded-xl border-[1.5px] border-field-line bg-white px-[17px] py-[15px] text-[15.5px] text-teal outline-none transition-colors placeholder:text-faint focus:border-red";

const TEXT_FIELDS = [
  { name: "business", label: "Business name", type: "text" },
  { name: "abn", label: "ABN", type: "text" },
  { name: "contact", label: "Contact name", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone", type: "tel" },
] as const;

/** The trade-account form in v7's apply band (reference lines 389-417). */
export function TradeForm() {
  const { state, error, submit, reset } = useFormPost("/api/wholesale");

  if (state === "sent") {
    return (
      <div className="py-[clamp(30px,4vw,50px)] text-center">
        <div
          className="mx-auto mb-5.5 flex h-[62px] w-[62px] items-center justify-center rounded-full bg-red text-[28px] text-white"
          aria-hidden="true"
        >
          ✓
        </div>
        <div className="mb-3 font-serif text-[28px]">Application received</div>
        <p className="mx-auto mb-6 max-w-[34ch] text-[15.5px] leading-[1.7] text-body">
          We&apos;ll come back within one business day with your pricing and the
          trade pack.
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
      <div className="mb-5.5 font-serif text-[clamp(22px,2.2vw,28px)]">
        Open a trade account
      </div>

      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          void submit(Object.fromEntries(data.entries()));
        }}
        className="grid gap-3.5"
      >
        {TEXT_FIELDS.map((f) => (
          <div key={f.name}>
            <label htmlFor={`trade-${f.name}`} className="sr-only-label">
              {f.label}
            </label>
            <input
              id={`trade-${f.name}`}
              name={f.name}
              type={f.type}
              required
              aria-required="true"
              placeholder={f.label}
              className={FIELD}
            />
          </div>
        ))}

        <div>
          <label htmlFor="trade-businessType" className="sr-only-label">
            Business type
          </label>
          <select
            id="trade-businessType"
            name="businessType"
            required
            aria-required="true"
            defaultValue=""
            className={FIELD}
          >
            <option value="" disabled>
              Business type
            </option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="trade-notes" className="sr-only-label">
            What are you looking to stock?
          </label>
          <textarea
            id="trade-notes"
            name="notes"
            rows={3}
            placeholder="What are you looking to stock?"
            className={`${FIELD} resize-y`}
          />
        </div>

        <Honeypot />

        {error ? (
          <p role="alert" className="text-[14px] font-semibold text-red">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={state === "sending"}
          className="cursor-pointer rounded-full bg-red px-7 py-4.5 text-[15px] font-extrabold text-white transition-colors hover:bg-teal disabled:cursor-wait disabled:opacity-70"
        >
          {state === "sending" ? "Sending…" : "Send application"}
        </button>
      </form>
    </div>
  );
}
