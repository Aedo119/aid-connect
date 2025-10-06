// models/userModel.js
import { pool } from "../server.js"; // your db connection (not from server.js)
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


export const createDonor = async (userData) => {
  const {
    firstname,
    lastname,
    email,
    passwordHash,
    phoneNumber,
    address,
    postalCode,
  } = userData;

  const query = `
    INSERT INTO users 
    (first_name,last_name, email, password_hash, phone_number, address_line1, postal_code,role)
    VALUES (?, ?, ?, ?, ?, ?,?,?)
  `;

  const values = [
    firstname,
    lastname,
    email,
    passwordHash,
    phoneNumber,
    address,
    postalCode,
    "donor",
  ];

  try {
    const res = await pool.query(query, values); // execute query
    return res; // nothing on success
  } catch (error) {
    throw error; // let controller handle error
  }
};

export const getProfileDetails = async (email) => {
  try {
    // Get all organizations
    const [rows] = await pool.query("SELECT * FROM Users");

    // Decrypt each email and find matching record
    const donor = rows.find((row) => {
      try {
        return decrypt(row.email) === email;
      } catch {
        return false;
      }
    });

    if (!donor) return null;

    // Decrypt other fields if needed
    const decryptedDonor = {
      id: donor.user_id,
      name: decrypt(donor.first_name),
      email: email,
      phoneNumber: decrypt(donor.phone_number),
      address: decrypt(donor.address_line1),
      postalCode: decrypt(donor.postal_code),
    };

    return decryptedDonor;
  } catch (error) {
    console.error("Error fetching profile details:", error);
    throw error;
  }
};
