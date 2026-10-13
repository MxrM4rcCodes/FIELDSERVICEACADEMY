import { createAccount } from "@/lib/accounts";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_NAME?.trim();
  if (!email || !password || !fullName) {
    throw new Error("Set ADMIN_EMAIL, ADMIN_PASSWORD (12+ characters), and ADMIN_NAME before running this command.");
  }
  if (password.length < 12 || password.length > 128) {
    throw new Error("ADMIN_PASSWORD must be 12–128 characters long.");
  }

  const account = await createAccount({ email, password, fullName, role: "admin" });
  console.log(`Administrator account created: ${account.email}`);
  console.log("No password was printed. Store credentials in your deployment secret manager.");
}

main().catch((error: unknown) => {
  const databaseError = error as { code?: string };
  if (databaseError.code === "23505") {
    console.error("That email already exists. No role changes were made.");
  } else {
    console.error("Administrator bootstrap failed:", error);
  }
  process.exitCode = 1;
});
