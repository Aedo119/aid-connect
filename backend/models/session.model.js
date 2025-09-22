import { pool } from "../server.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

const IV_LENGTH = 16;

function decrypt(encryptedText) {
  if (!encryptedText) return null;
  const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedData = textParts.join(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Validate user (donor) login
export const validateUser = async ({ email, password }) => {
  console.log("Starting user validation for email:", email);

  // Get all users to check against encrypted emails
  let [userRows] = await pool.query("SELECT * FROM users");
  console.log("Retrieved users from database");

  let foundUser = null;

  // Check users table
  for (const user of userRows) {
    try {
      const decryptedEmail = decrypt(user.email);
      if (decryptedEmail === email) {
        foundUser = user;
        console.log("Found user in users table");
        break;
      }
    } catch (error) {
      console.log("Error decrypting user email:", error.message);
      continue;
    }
  }

  if (!foundUser) {
    console.log("No user found with this email");
    throw new Error("Invalid email or password");
  }

  // Check password
  const isValid = await bcrypt.compare(password, foundUser.password_hash);
  if (!isValid) {
    console.log("Invalid password");
    throw new Error("Invalid email or password");
  }

  console.log("User validation successful");

  let name=decrypt(foundUser.first_name)

  // Return user data with decrypted email
  return {
    id: foundUser.id,
    email: email, // Use the original email, not the encrypted one
    type: "user",
    name:name
  };
};

// Validate organization login
export const validateOrganization = async ({ email, password }) => {
  console.log("Starting organization validation for email:", email);

  // Get all organizations to check against encrypted emails
  let [orgRows] = await pool.query("SELECT * FROM organizations");
  console.log("Retrieved organizations from database");

  let foundOrg = null;

  // Check organizations table
  for (const org of orgRows) {
    try {
      const decryptedEmail = decrypt(org.email);
      if (decryptedEmail === email) {
        foundOrg = org;
        console.log("Found organization in organizations table");
        break;
      }
    } catch (error) {
      console.log("Error decrypting org email:", error.message);
      continue;
    }
  }

  if (!foundOrg) {
    console.log("No organization found with this email");
    throw new Error("Invalid email or password");
  }

  // Check password
  const isValid = await bcrypt.compare(password, foundOrg.password_hash);
  if (!isValid) {
    console.log("Invalid password");
    throw new Error("Invalid email or password");
  }

  console.log("Organization validation successful");
  let name=decrypt(foundOrg.name);
  
  // Return organization data with decrypted email
  return {
    id: foundOrg.id,
    email: email, // Use the original email, not the encrypted one
    type: "organization",
    name:name
  };
};

export const storeTokens = async (tokenData) => {
  const { session_id, email, refresh_token, user_agent, ip } = tokenData;

  try {
    await pool.query(
      `INSERT INTO sessions 
        (session_id, email, refresh_token, expires_at, user_agent, ip) 
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), ?, ?)`,
      [session_id, email, refresh_token, user_agent, ip]
    );
    return true;
  } catch (error) {
    console.error("Error storing session:", error);
    throw error;
  }
};

export const findSessionByToken = async (refreshToken) => {
  const [rows] = await pool.query(
    "SELECT * FROM sessions WHERE refresh_token = ? AND revoked = 0 AND expires_at > NOW()",
    [refreshToken]
  );
  return rows.length > 0 ? rows[0] : null;
};

export const rotateRefreshToken = async (sessionId) => {
  const crypto = await import("crypto");
  const newRefreshToken = crypto.randomBytes(64).toString("hex");
  await pool.query(
    "UPDATE sessions SET refresh_token = ?, expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE id = ?",
    [newRefreshToken, sessionId]
  );
  return newRefreshToken;
};
