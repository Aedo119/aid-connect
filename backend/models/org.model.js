// models/userModel.js
import { pool } from "../server.js";
import crypto from "crypto";

const IV_LENGTH = 16;

export const createOrg = async (userData) => {
  const {
    name,
    description,
    websiteUrl,
    email,
    passwordHash,
    phoneNumber,
    address,
    postalCode,
  } = userData;

  const query = `
    INSERT INTO Organizations
    (name,description,website_url,email, password_hash, phone_number, address_line1, postal_code)
    VALUES (?, ?, ?, ?, ?, ?,?,?)
  `;

  const values = [
    name,
    description,
    websiteUrl,
    email,
    passwordHash,
    phoneNumber,
    address,
    postalCode,
  ];

  try {
    const res = await pool.query(query, values); // execute query
    return res; // nothing on success
  } catch (error) {
    throw error; // let controller handle error
  }
};

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

export const getProfileDetails = async (email) => {
  try {
    // Get all organizations
    const [rows] = await pool.query("SELECT * FROM Organizations");

    // Decrypt each email and find matching record
    const org = rows.find((row) => {
      try {
        return decrypt(row.email) === email;
      } catch {
        return false;
      }
    });

    if (!org) return null;

    // Decrypt other fields if needed
    const decryptedOrg = {
      id: org.organization_id,
      name: decrypt(org.name),
      description: decrypt(org.description),
      websiteUrl: decrypt(org.website_url),
      email: email,
      phoneNumber: decrypt(org.phone_number),
      address: decrypt(org.address_line1),
      postalCode: decrypt(org.postal_code),
    };

    return decryptedOrg;
  } catch (error) {
    console.error("Error fetching profile details:", error);
    throw error;
  }
};
