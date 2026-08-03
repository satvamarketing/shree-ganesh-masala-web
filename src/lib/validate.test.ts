import { describe, expect, it } from "vitest";
import { validate } from "./validate";

const spec = [
  { key: "name", label: "Your name", required: true, max: 100 },
  { key: "email", label: "Email", required: true, email: true },
  { key: "notes", label: "Notes" },
];

describe("validate", () => {
  it("accepts a well-formed body and trims values", () => {
    const r = validate({ name: "  Asha  ", email: "a@b.com" }, spec);
    expect(r).toEqual({
      ok: true,
      values: { name: "Asha", email: "a@b.com", notes: "" },
    });
  });

  it("rejects a missing required field, naming it", () => {
    const r = validate({ email: "a@b.com" }, spec);
    expect(r).toEqual({ ok: false, error: "Your name is required." });
  });

  it("rejects a whitespace-only required field", () => {
    expect(validate({ name: "   ", email: "a@b.com" }, spec).ok).toBe(false);
  });

  it("rejects a malformed email", () => {
    const r = validate({ name: "Asha", email: "not-an-email" }, spec);
    expect(r).toEqual({
      ok: false,
      error: "Email must be a valid email address.",
    });
  });

  it("rejects an over-long value", () => {
    const r = validate({ name: "x".repeat(101), email: "a@b.com" }, spec);
    expect(r).toEqual({ ok: false, error: "Your name is too long." });
  });

  it("rejects a filled honeypot without explaining why", () => {
    const r = validate({ name: "Asha", email: "a@b.com", company: "bot" }, spec);
    expect(r).toEqual({ ok: false, error: "Submission rejected." });
  });

  it("rejects a non-object body", () => {
    expect(validate(null, spec).ok).toBe(false);
    expect(validate("nope", spec).ok).toBe(false);
    expect(validate([1, 2], spec).ok).toBe(false);
  });

  it("accepts a value from a oneOf list", () => {
    const r = validate(
      { name: "Asha", email: "a@b.com", kind: "Grocer" },
      [...spec, { key: "kind", label: "Business type", required: true, oneOf: ["Grocer", "Caterer"] }],
    );
    expect(r.ok && r.values.kind).toBe("Grocer");
  });

  it("rejects a value outside a oneOf list, so a tampered select cannot get through", () => {
    const r = validate(
      { name: "Asha", email: "a@b.com", kind: "Wholesaler" },
      [...spec, { key: "kind", label: "Business type", required: true, oneOf: ["Grocer", "Caterer"] }],
    );
    expect(r).toEqual({ ok: false, error: "Business type is not a valid choice." });
  });

  it("ignores unspecified fields rather than passing them through", () => {
    const r = validate({ name: "Asha", email: "a@b.com", admin: "true" }, spec);
    expect(r.ok && "admin" in r.values).toBe(false);
  });
});
