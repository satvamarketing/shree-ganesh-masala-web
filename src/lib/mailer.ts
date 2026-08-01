import { Resend } from "resend";
import { site } from "@/data/site";

const TO = process.env.FORM_TO_EMAIL ?? site.email;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * With RESEND_API_KEY unset the payload is logged and the call succeeds, so the
 * site runs locally and in preview without secrets. See spec §7.
 */
export async function sendFormEmail({
  subject,
  lines,
}: {
  subject: string;
  lines: [string, string][];
}): Promise<void> {
  const text = lines
    .map(([label, value]) => `${label}: ${value || "not provided"}`)
    .join("\n");
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.info(`[form] ${subject}\n${text}`);
    return;
  }

  const html =
    `<h2>${escapeHtml(subject)}</h2><table cellpadding="6">` +
    lines
      .map(
        ([label, value]) =>
          `<tr><td><strong>${escapeHtml(label)}</strong></td>` +
          `<td>${escapeHtml(value) || "not provided"}</td></tr>`,
      )
      .join("") +
    `</table>`;

  const replyTo = lines.find(([label]) => label === "Email")?.[1];

  const { error } = await new Resend(key).emails.send({
    from: `${site.name} website <website@shreeganesh.com.au>`,
    to: [TO],
    replyTo: replyTo || undefined,
    subject,
    text,
    html,
  });

  if (error) throw new Error(error.message);
}
