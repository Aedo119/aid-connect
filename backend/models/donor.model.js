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
    (first_name,last_name, email, password_hash, phone_number, address_line1, postal_code)
    VALUES (?, ?, ?, ?, ?, ?,?)
  `;

  const values = [
    firstname,
    lastname,
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
