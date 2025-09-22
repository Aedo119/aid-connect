// models/userModel.js
import { pool } from "../server.js"; // your db connection (not from server.js)

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
    "Organization",
  ];

  try {
    const res = await pool.query(query, values); // execute query
    return res; // nothing on success
  } catch (error) {
    throw error; // let controller handle error
  }
};

export const getProfileDetails = async (email) => {
  const query = `
    SELECT *
    FROM Users
    WHERE email = ?
    LIMIT 1
  `;
  try {
    const [rows] = await pool.query(query, [email]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    throw error;
  }
};
