#!/usr/bin/env node

// Script to generate a secure encryption key for AES-256-CBC
const crypto = require("crypto");

console.log(
  "🔐 Generating 32-character hex encryption key for AES-256-CBC...\n"
);

const encryptionKey = crypto.randomBytes(16).toString("hex");

console.log("Generated Encryption Key:");
console.log(encryptionKey);
console.log("\n📝 Add this to your .env file as:");
console.log(`ENCRYPTION_KEY=${encryptionKey}`);
console.log(
  "\n⚠️  Keep this key secure and never commit it to version control!"
);
