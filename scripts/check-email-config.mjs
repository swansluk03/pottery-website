import { config } from "dotenv";

config({ path: ".env.local" });

function isTestSender(fromAddress) {
  return fromAddress.includes("@resend.dev");
}

const checks = [];
let hasErrors = false;

function pass(message) {
  checks.push({ level: "ok", message });
}

function warn(message) {
  checks.push({ level: "warn", message });
}

function fail(message) {
  checks.push({ level: "error", message });
  hasErrors = true;
}

const apiKey = process.env.RESEND_API_KEY?.trim();
const contactEmail = process.env.CONTACT_EMAIL?.trim();
const emailFrom =
  process.env.EMAIL_FROM?.trim() ??
  "Barn Owl Pottery <onboarding@resend.dev>";

if (!apiKey) {
  fail("RESEND_API_KEY is not set.");
} else if (!apiKey.startsWith("re_")) {
  warn("RESEND_API_KEY is set but does not start with re_. Double-check the value.");
} else {
  pass("RESEND_API_KEY is set.");
}

if (!contactEmail) {
  warn(
    "CONTACT_EMAIL is not set. The site will fall back to the email stored in page content."
  );
} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
  fail(`CONTACT_EMAIL looks invalid: ${contactEmail}`);
} else {
  pass(`CONTACT_EMAIL is set (${contactEmail}).`);
}

if (!process.env.EMAIL_FROM?.trim()) {
  warn("EMAIL_FROM is not set. Using Resend test sender onboarding@resend.dev.");
} else {
  pass(`EMAIL_FROM is set (${emailFrom}).`);
}

if (isTestSender(emailFrom)) {
  warn(
    "EMAIL_FROM uses onboarding@resend.dev. Resend only delivers to your Resend account email until you verify a custom domain."
  );
  warn(
    "For production, verify your domain at https://resend.com/domains and set EMAIL_FROM to something like \"Barn Owl Pottery <hello@yourdomain.com>\"."
  );
}

console.log("\nEmail configuration check\n");

for (const check of checks) {
  const prefix =
    check.level === "ok" ? "✓" : check.level === "warn" ? "!" : "✗";
  console.log(`${prefix} ${check.message}`);
}

console.log("\nNext steps:");
console.log("Run: npm run setup:resend");
console.log("That prints the full Resend account, API key, and domain setup checklist.");

if (hasErrors) {
  process.exit(1);
}
