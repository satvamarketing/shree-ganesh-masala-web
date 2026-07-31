import { makeFormRoute } from "@/lib/form-route";
import type { FieldSpec } from "@/lib/validate";

export const SUBSCRIBE_FIELDS: FieldSpec[] = [
  { key: "email", label: "Email", required: true, email: true, max: 200 },
];

export const POST = makeFormRoute({
  name: "subscribe",
  spec: SUBSCRIBE_FIELDS,
  subject: () => "Newsletter subscription",
  failureMessage: "We could not subscribe you just then. Please try again.",
});
