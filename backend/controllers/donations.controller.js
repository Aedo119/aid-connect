import { insertMoneyDonation } from "../models/donations.model.js";
import { insertFoodDonation } from "../models/donations.model.js";
import { insertClothingDonation } from "../models/donations.model.js";
import { insertMedicalDonation } from "../models/donations.model.js";
import { pool } from "../server.js";
import crypto from "crypto";

const IV_LENGTH = 16;

function decrypt(encryptedText) {
  if (!encryptedText) return null;
  const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedData = textParts.join(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// handle money donation submission
export const createMoneyDonation = async (req, res) => {
  try {
    const {
      amount,
      paymentMethod,
      cardNumber,
      cardExpiry,
      cardCvv,
      upiId,
      campaign_id,
      donor_id,
    } = req.body;

    console.log("amount:", amount);
    // ✅ validation
    if (!amount || !campaign_id) {
      return res
        .status(400)
        .json({ message: "Amount and campaign_id are required" });
    }

    // ✅ map frontend paymentMethod to DB enum
    let payment_method = "Cash";
    if (paymentMethod === "card") payment_method = "Credit/Debit Card";
    else if (paymentMethod === "upi") payment_method = "UPI";
    else if (paymentMethod === "netbanking") payment_method = "NetBanking";

    // ✅ create dummy transaction_id (if not from payment gateway)
    const transaction_id = `TXN-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;

    const donationData = {
      campaign_id,
      donor_id,
      amount,
      payment_method,
      transaction_id,
      status: "Success", // in production, you’d update after payment confirmation
    };

    const donationId = await insertMoneyDonation(donationData);

    res.status(201).json({
      message: "Money donation recorded successfully",
      donation_id: donationId,
      transaction_id,
    });
  } catch (error) {
    console.error("Error creating money donation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createFoodDonation = async (req, res) => {
  try {
    const {
      campaign_id,
      donor_id,
      foodItems,
      foodQuantity,
      dropoffLocation,
      timeSlot,
      specialInstructions,
    } = req.body;

    if (!foodItems || !campaign_id) {
      return res
        .status(400)
        .json({ message: "Food items and campaign_id are required" });
    }

    const donationData = {
      campaign_id,
      donor_id,
      food_items: foodItems,
      estimated_quantity: foodQuantity,
      drop_off_location: dropoffLocation,
      preferred_time_slot: timeSlot,
      special_instructions: specialInstructions,
      status: "Pending",
    };

    const donationId = await insertFoodDonation(donationData);

    res.status(201).json({
      message: "Food donation recorded successfully",
      food_donation_id: donationId,
    });
  } catch (error) {
    console.error("Error creating food donation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createClothingDonation = async (req, res) => {
  try {
    const {
      campaign_id,
      donor_id,
      clothingType,
      clothingCondition,
      dropoffLocation,
      specialInstructions,
    } = req.body;

    if (!clothingType || !campaign_id) {
      return res
        .status(400)
        .json({ message: "Clothing type and campaign_id are required" });
    }

    const donationData = {
      campaign_id,
      donor_id,
      clothing_types: Array.isArray(clothingType)
        ? clothingType
        : [clothingType],
      conditions: clothingCondition,
      drop_off_location: dropoffLocation,
      special_instructions: specialInstructions,
      status: "Pending",
    };

    const donationId = await insertClothingDonation(donationData);

    res.status(201).json({
      message: "Clothing donation recorded successfully",
      clothing_donation_id: donationId,
    });
  } catch (error) {
    console.error("Error creating clothing donation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createMedicalDonation = async (req, res) => {
  try {
    const {
      campaign_id,
      donor_id,
      medicalItems,
      quantityDescription,
      expiryDate,
      medicalCondition,
      specialInstructions,
      pickupRequested,
    } = req.body;

    if (!medicalItems || !campaign_id) {
      return res
        .status(400)
        .json({ message: "Medical items and campaign_id are required" });
    }

    const donationData = {
      campaign_id,
      donor_id,
      item_list: Array.isArray(medicalItems) ? medicalItems : [medicalItems],
      quantity_description: quantityDescription,
      expiry_date: expiryDate || null,
      conditions: medicalCondition || null,
      special_instructions: specialInstructions || null,
      pickup: pickupRequested || false,
      status: "Pending",
    };

    const donationId = await insertMedicalDonation(donationData);

    res.status(201).json({
      message: "Medical donation recorded successfully",
      medical_donation_id: donationId,
    });
  } catch (error) {
    console.error("Error creating medical donation:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllDonationsByOrg = async (req, res) => {
  const { organization_id } = req.params;
  console.log("irg", organization_id);
  try {
    // 💰 MONEY donations
    const [money] = await pool.query(
      `SELECT 
          u.first_name AS donor_name,
          d.donation_date AS date,
          d.amount AS amount,
          c.title AS campaign_name,
          'Money' AS type
       FROM MoneyDonations d
       JOIN Campaigns c ON d.campaign_id = c.campaign_id
       JOIN Users u ON d.donor_id = u.user_id
       WHERE c.organization_id = ?`,
      [organization_id]
    );

    // 🍎 FOOD donations
    const [food] = await pool.query(
      `SELECT 
          u.first_name AS donor_name,
          d.donation_date AS date,
          d.food_items AS items,
          c.title AS campaign_name,
          'Food' AS type
       FROM FoodDonations d
       JOIN Campaigns c ON d.campaign_id = c.campaign_id
       JOIN Users u ON d.donor_id = u.user_id
       WHERE c.organization_id = ?`,
      [organization_id]
    );

    // 👕 CLOTHING donations
    const [clothes] = await pool.query(
      `SELECT 
          u.first_name AS donor_name,
          d.donation_date AS date,
          'Cloth' AS items,
          c.title AS campaign_name,
          'Clothing' AS type
       FROM ClothingDonations d
       JOIN Campaigns c ON d.campaign_id = c.campaign_id
       JOIN Users u ON d.donor_id = u.user_id
       WHERE c.organization_id = ?`,
      [organization_id]
    );

    // 💊 MEDICAL donations
    const [medical] = await pool.query(
      `SELECT 
          u.first_name AS donor_name,
          d.donation_date AS date,
          'Medical Supplies' AS items,
          c.title AS campaign_name,
          'Medical' AS type
       FROM MedicalDonations d
       JOIN Campaigns c ON d.campaign_id = c.campaign_id
       JOIN Users u ON d.donor_id = u.user_id
       WHERE c.organization_id = ?`,
      [organization_id]
    );

    // Combine everything
    let allDonations = [...money, ...food, ...clothes, ...medical];

    allDonations = allDonations.map((donation) => ({
      ...donation,
      donor_name: donation.donor_name
        ? decrypt(donation.donor_name)
        : "Anonymous",
    }));

    // Sort by most recent date
    allDonations.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ donations: allDonations });
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};
