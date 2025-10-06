import { pool } from "../server.js";

export const insertMoneyDonation = async (donationData) => {
  const {
    campaign_id,
    donor_id,
    amount,
    payment_method,
    transaction_id,
    status,
  } = donationData;

  const query = `
    INSERT INTO MoneyDonations 
    (campaign_id, donor_id, amount, payment_method, transaction_id, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    campaign_id,
    donor_id || null,
    amount,
    payment_method,
    transaction_id || null,
    status || "Pending",
  ];
  const query2 = `
    UPDATE Campaigns
    SET raised_amount = COALESCE(raised_amount, 0) + ?,
        donors = donors + 1
    WHERE campaign_id = ?
  `;
  await pool.query(query2,[amount,campaign_id]);

  const [result] = await pool.query(query, values);
  return result.insertId;
};


export const insertFoodDonation = async (donationData) => {
  const {
    campaign_id,
    donor_id,
    food_items,
    estimated_quantity,
    drop_off_location,
    preferred_time_slot,
    special_instructions,
    status,
  } = donationData;

  const query = `
    INSERT INTO FoodDonations 
    (campaign_id, donor_id, food_items, estimated_quantity, drop_off_location, preferred_time_slot, special_instructions, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    campaign_id,
    donor_id || null,
    food_items,
    estimated_quantity || null,
    drop_off_location || null,
    preferred_time_slot || null,
    special_instructions || null,
    status || "Pending",
  ];
  const query2 = `
    UPDATE Campaigns
    SET donors = donors + 1
    WHERE campaign_id = ?
  `;
  await pool.query(query2,[campaign_id]);
  const [result] = await pool.query(query, values);
  return result.insertId;
};


export const insertClothingDonation = async (donationData) => {
  const {
    campaign_id,
    donor_id,
    clothing_types,
    conditions,
    drop_off_location,
    special_instructions,
    status,
  } = donationData;

  const query = `
    INSERT INTO ClothingDonations
    (campaign_id, donor_id, clothing_types, conditions, drop_off_location, special_instructions, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    campaign_id,
    donor_id || null,
    JSON.stringify(clothing_types),
    conditions,
    drop_off_location || null,
    special_instructions || null,
    status || "Pending",
  ];
  const query2 = `
    UPDATE Campaigns
    SET donors = donors + 1
    WHERE campaign_id = ?
  `;
  await pool.query(query2,[campaign_id]);

  const [result] = await pool.query(query, values);
  return result.insertId;
};


export const insertMedicalDonation = async (donationData) => {
  const {
    campaign_id,
    donor_id,
    item_list,
    quantity_description,
    expiry_date,
    conditions,
    special_instructions,
    pickup,
    status,
  } = donationData;

  const query = `
    INSERT INTO MedicalDonations
    (campaign_id, donor_id, item_list, quantity_description, expiry_date, conditions, special_instructions, pickup, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    campaign_id,
    donor_id || null,
    JSON.stringify(item_list),
    quantity_description || null,
    expiry_date || null,
    conditions || null,
    special_instructions || null,
    pickup || false,
    status || "Pending",
  ];

  const query2 = `
    UPDATE Campaigns
    SET donors = donors + 1
    WHERE campaign_id = ?
  `;
  await pool.query(query2,[campaign_id]);

  const [result] = await pool.query(query, values);
  return result.insertId;
};




