import express from "express";
import {
  createMoneyDonation,
  createFoodDonation,
  createClothingDonation,
  createMedicalDonation,
  getAllDonationsByOrg,
  getUserDonationHistory,
  getUserImpact
} from "../controllers/donations.controller.js";

const router = express.Router();

router.post("/money", createMoneyDonation);
router.post("/food", createFoodDonation);
router.post("/clothing", createClothingDonation);
router.post("/medical",createMedicalDonation);
router.get("/:organization_id",getAllDonationsByOrg)
router.get("/user/:user_id",getUserDonationHistory)
router.get("/impact/:user_id",getUserImpact);

export default router;
