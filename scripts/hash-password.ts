import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2];

  if (!password) {
    console.error('Usage: npm run hash-password -- "your-password"');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  const escaped = hash.replace(/\$/g, "\\$");
  console.log("Raw hash:");
  console.log(hash);
  console.log("\nFor .env.local (escape $ for Next.js):");
  console.log(`ADMIN_PASSWORD_HASH="${escaped}"`);
}

main();
