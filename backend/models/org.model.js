// models/userModel.js
import { pool } from "../server.js"; // your db connection (not from server.js)

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
