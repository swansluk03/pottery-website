import { execSync } from "node:child_process";

if (process.env.DATABASE_URL) {
  console.log("Running prisma db push...");
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
} else {
  console.warn(
    "DATABASE_URL is not set — skipping prisma db push. Add it in Vercel env vars (Production)."
  );
}

execSync("next build", { stdio: "inherit" });
