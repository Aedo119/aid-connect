import express from "express";
import { signup,getProfile } from "../controllers/org.controller.js"
import { verifyToken } from "../controllers/session.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/profile", verifyToken, getProfile);

export default router;