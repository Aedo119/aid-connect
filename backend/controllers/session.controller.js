import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import cookieParser from "cookie-parser";
import { pool } from "../server.js";
import {
  validateUser,
  validateOrganization,
  storeTokens,
  rotateRefreshToken,
  findSessionByToken,
} from "../models/session.model.js";

const router = express.Router();

// JWT secret (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: user.type,
      name:user.name
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// Middleware to verify access token
export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// User (Donor) Login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await validateUser({ email, password });
  } catch (error) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = crypto.randomBytes(64).toString("hex");

  // Store refresh in DB
  const tokenData = {
    session_id: crypto.randomBytes(32).toString("hex"),
    email: email,
    refresh_token: refreshToken,
    user_agent: req.headers["user-agent"] || null,
    ip: req.ip,
  };

  try {
    await storeTokens(tokenData);
  } catch (error) {
    return res.status(500).json({ error: "Error storing refresh token" });
  }

  // Send cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({
    message: "User logged in successfully",
    user: { id: user.id, email: user.email, type: user.type ,name:user.name},
  });
};

// Organization (NGO) Login
export const orgLogin = async (req, res) => {
  const { email, password } = req.body;

  let organization;
  try {
    organization = await validateOrganization({ email, password });
  } catch (error) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  // Generate tokens
  const accessToken = generateAccessToken(organization);
  const refreshToken = crypto.randomBytes(64).toString("hex");

  // Store refresh in DB
  const tokenData = {
    session_id: crypto.randomBytes(32).toString("hex"),
    email: email,
    refresh_token: refreshToken,
    user_agent: req.headers["user-agent"] || null,
    ip: req.ip,
  };

  try {
    await storeTokens(tokenData);
  } catch (error) {
    return res.status(500).json({ error: "Error storing refresh token" });
  }

  // Send cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return res.status(200).json({
    message: "Organization logged in successfully",
    user: {
      id: organization.id,
      email: organization.email,
      type: organization.type,
      name:organization.name
    },
  });
};

export const refreshToken = async (req, res) => {
  const refreshTokenCookie = req.cookies.refreshToken;
  if (!refreshTokenCookie) {
    return res.status(401).json({ error: "No refresh token" });
  }

  // Find session
  const session = await findSessionByToken(refreshTokenCookie);
  if (!session) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  // Try to find user in both tables
  let user = null;
  try {
    user = await validateUser({ email: session.email });
  } catch (error) {
    // If not found in users, try organizations
    try {
      user = await validateOrganization({ email: session.email });
    } catch (orgError) {
      return res.status(404).json({ error: "User not found" });
    }
  }

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Rotate refresh token
  const newRefreshToken = await rotateRefreshToken(session.id);

  // New access token
  const newAccessToken = generateAccessToken(user);

  // Update cookies
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Token refreshed successfully" });
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      await pool.query(
        "UPDATE sessions SET revoked = 1 WHERE refresh_token = ?",
        [refreshToken]
      );
    } catch (error) {
      console.error("Error revoking session:", error);
    }
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export const getProfile = async (req, res) => {
  // This endpoint is protected by verifyToken middleware
  res.json({
    user: req.user,
    message: "Profile retrieved successfully",
  });
};

export default router;
