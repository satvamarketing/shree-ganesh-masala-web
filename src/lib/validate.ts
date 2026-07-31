export type FieldSpec = {
  key: string;
  label: string;
  required?: boolean;
  email?: boolean;
  max?: number;
};

export type ValidateResult =
  | { ok: true; values: Record<string, string> }
  | { ok: false; error: string };

/** Deliberately loose: catches typos without rejecting valid odd addresses. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Hidden field real users never fill. Named innocuously to bait bots. */
export const HONEYPOT = "company";

export function validate(body: unknown, spec: FieldSpec[]): ValidateResult {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { ok: false, error: "Submission rejected." };
  }
  const raw = body as Record<string, unknown>;

  // Say nothing useful to a bot about why it failed.
  if (typeof raw[HONEYPOT] === "string" && raw[HONEYPOT].trim() !== "") {
    return { ok: false, error: "Submission rejected." };
  }

  const values: Record<string, string> = {};
  for (const field of spec) {
    const value =
      typeof raw[field.key] === "string" ? (raw[field.key] as string).trim() : "";

    if (field.required && value === "") {
      return { ok: false, error: `${field.label} is required.` };
    }
    if (value !== "" && field.max && value.length > field.max) {
      return { ok: false, error: `${field.label} is too long.` };
    }
    if (value !== "" && field.email && !EMAIL.test(value)) {
      return { ok: false, error: `${field.label} must be a valid email address.` };
    }
    values[field.key] = value;
  }
  return { ok: true, values };
}
