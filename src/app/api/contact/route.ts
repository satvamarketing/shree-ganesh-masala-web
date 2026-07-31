import { makeFormRoute } from "@/lib/form-route";
import type { FieldSpec } from "@/lib/validate";

export const CONTACT_FIELDS: FieldSpec[] = [
  { key: "name", label: "Your name", required: true, max: 120 },
  { key: "email", label: "Email", required: true, email: true, max: 200 },
  { key: "subject", label: "Subject", required: true, max: 200 },
  { key: "message", label: "Message", required: true, max: 4000 },
];

export const POST = makeFormRoute({
  name: "contact",
  spec: CONTACT_FIELDS,
  subject: (v) => `Website enquiry — ${v.subject}`,
  failureMessage:
    "We could not send your message. Please email info@shreeganesh.com.au instead.",
});
