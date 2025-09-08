import express from "express";
import {
  userLogin,
  orgLogin,
  logout,
  refreshToken,
  getProfile,
  verifyToken,
} from "../controllers/session.controller.js";

const router = express.Router();

// Authentication routes
router.post("/user/login", userLogin);
router.post("/org/login", orgLogin);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.get("/profile", verifyToken, getProfile);

export default router;
