import { NextResponse } from "next/server";
import { sendFormEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { validate, type FieldSpec } from "@/lib/validate";

/**
 * Builds a POST handler for one of the site's three forms. They differ only in
 * their field spec and subject line, so the validation, rate limiting, delivery
 * and error shape live here once.
 *
 * Responses are always JSON: `{ ok: true }`, or `{ error }` with a 4xx/5xx.
 */
export function makeFormRoute({
  name,
  spec,
  subject,
  failureMessage,
}: {
  /** Used for the rate-limit key and server logs. */
  name: string;
  spec: FieldSpec[];
  subject: (values: Record<string, string>) => string;
  failureMessage: string;
}) {
  return async function POST(request: Request) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (!rateLimit(`${name}:${ip}`)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again shortly." },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    const result = validate(body, spec);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    try {
      await sendFormEmail({
        subject: subject(result.values),
        lines: spec.map((f) => [f.label, result.values[f.key]]),
      });
    } catch (err) {
      console.error(`[${name}] send failed`, err);
      return NextResponse.json({ error: failureMessage }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  };
}
