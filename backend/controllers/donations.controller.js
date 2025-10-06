import { insertMoneyDonation } from "../models/donations.model.js";
import { insertFoodDonation } from "../models/donations.model.js";
import { insertClothingDonation } from "../models/donations.model.js";
import { insertMedicalDonation } from "../models/donations.model.js";



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

    console.log("amount:",amount)
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
    const transaction_id = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

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







