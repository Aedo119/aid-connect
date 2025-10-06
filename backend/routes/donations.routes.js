import express from "express";
import {
  createMoneyDonation,
  createFoodDonation,
  createClothingDonation,
  createMedicalDonation
} from "../controllers/donations.controller.js";

const router = express.Router();

router.post("/money", createMoneyDonation);
router.post("/food", createFoodDonation);
router.post("/clothing", createClothingDonation);
router.post("/medical",createMedicalDonation);

export default router;
