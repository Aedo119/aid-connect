// controllers/userController.js
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { createDonor, getProfileDetails } from "../models/donor.model.js";

const IV_LENGTH = 16;

function encrypt(text) {
  const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  if (!text) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export const signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phoneNumber,
      address,
      postalCode,
    } = req.body;

    // 🔹 Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 🔹 Encrypt sensitive fields
    const encryptedData = {
      firstname: encrypt(firstname),
      lastname: encrypt(lastname),
      email: encrypt(email),
      phoneNumber: encrypt(phoneNumber),
      address: encrypt(address),
      postalCode: encrypt(postalCode),
      passwordHash, // store hashed password, not encrypted
    };

    const result = await createDonor(encryptedData);
    if (!result) {
      return res.status(500).json({ error: "Failed to connect to db" });
    }
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(401).json({ error: "Something went wrong in creating user" });
  }
};

export const getProfile = async (req, res) => {
  // This endpoint is protected by verifyToken middleware
  const [user] = await getProfileDetails(req.user.email);
  console.log(user);
  res.json({
    user: user,
    message: "Profile retrieved successfully",
  });
};
