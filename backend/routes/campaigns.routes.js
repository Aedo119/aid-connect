import express from "express";
import { createCampaign, getCampaigns, getCampaignsByOrg ,getCampaignById, deleteCampaign, updateCampaign} from "../controllers/campaigns.controller.js";
import { verifyToken } from "../controllers/session.controller.js";

const router = express.Router();
// router.post("/create", verifyToken, createCampaign);

router.post("/create",verifyToken, createCampaign);
router.get("/all",getCampaigns);
router.get("/:id",getCampaignsByOrg);
router.get("/one/:id",getCampaignById);
router.delete("/delete/:campaign_id", deleteCampaign);
router.put("/update/:id",updateCampaign);

export default router;


