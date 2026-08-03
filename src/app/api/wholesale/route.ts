import { makeFormRoute } from "@/lib/form-route";
import type { FieldSpec } from "@/lib/validate";

/** The options offered by the trade form's business-type select. */
export const BUSINESS_TYPES = [
  "Grocer",
  "Restaurant",
  "Caterer",
  "Other",
] as const;

export const WHOLESALE_FIELDS: FieldSpec[] = [
  { key: "business", label: "Business name", required: true, max: 200 },
  { key: "abn", label: "ABN", required: true, max: 20 },
  { key: "contact", label: "Contact name", required: true, max: 120 },
  { key: "email", label: "Email", required: true, email: true, max: 200 },
  { key: "phone", label: "Phone", required: true, max: 40 },
  {
    key: "businessType",
    label: "Business type",
    required: true,
    oneOf: BUSINESS_TYPES,
  },
  { key: "notes", label: "What are you looking to stock?", max: 2000 },
];

export const POST = makeFormRoute({
  name: "wholesale",
  spec: WHOLESALE_FIELDS,
  subject: (v) => `Trade application: ${v.business} (${v.businessType})`,
  failureMessage:
    "We could not send your application. Please call us instead on 0490 729 900.",
});
