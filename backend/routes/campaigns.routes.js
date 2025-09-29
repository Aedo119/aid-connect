import express from "express";
import { createCampaign, getCampaigns } from "../controllers/campaigns.controller.js";
import { verifyToken } from "../controllers/session.controller.js";

const router = express.Router();
// router.post("/create", verifyToken, createCampaign);

router.post("/create", createCampaign);
router.get("/all",getCampaigns);

export default router;


