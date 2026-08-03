/**
 * Labelled input. The design uses placeholders as labels, so the real label is
 * visually hidden but present for screen readers.
 */
export function Field({
  name,
  label,
  type = "text",
  rows,
  required = false,
  tone,
}: {
  name: string;
  label: string;
  type?: string;
  rows?: number;
  required?: boolean;
  tone: "forest" | "cream";
}) {
  const shared =
    "w-full box-border rounded-xl border-[1.5px] px-[18px] py-[15px] text-[15.5px] outline-none transition-colors";
  const toneClasses =
    tone === "forest"
      ? "bg-teal-light border-teal-line text-[#F2F7EF] placeholder:text-[#F2F7EF]/55 focus:border-gold"
      : "bg-cream border-line-deep text-teal placeholder:text-faint focus:border-teal";

  const id = `field-${name}`;

  return (
    <div>
      <label htmlFor={id} className="sr-only-label">
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          aria-required={required || undefined}
          placeholder={label}
          className={`${shared} ${toneClasses} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          aria-required={required || undefined}
          placeholder={label}
          className={`${shared} ${toneClasses}`}
        />
      )}
    </div>
  );
}

/** The hidden field bots fill and humans never see. */
export function Honeypot() {
  return (
    <div className="sr-only-label" aria-hidden="true">
      <label htmlFor="field-company">Company</label>
      <input id="field-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
