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

export const createCampaign = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      goal_amount,
      start_date,
      end_date,
      status,
      location,
      is_emergency,
      image,
      label_left,
      label_right,
      donationTypes,
      organization_id, // assuming this comes from req.body
    } = req.body;

    // Basic validation
    if (
      !organization_id ||
      !title ||
      !goal_amount ||
      !start_date ||
      !end_date ||
      !location
    ) {
      return res.status(400).json({
        message:
          "organization_id, title, goal_amount, start_date, end_date, and location are required",
      });
    }

    // Insert campaign into Campaigns table
    const insertCampaignQuery = `
      INSERT INTO Campaigns
      (organization_id, emergency, title, description, fundraising_goal, start_date, end_date, status, category, location, tag, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const campaignValues = [
      organization_id,
      is_emergency || false,
      title,
      description || null,
      goal_amount,
      start_date,
      end_date,
      status || "Active",
      category || null,
      location,
      label_left && label_right ? `${label_left},${label_right}` : null,
      image || null,
    ];

    const [campaignResult] = await pool.query(
      insertCampaignQuery,
      campaignValues
    );

    const campaignId = campaignResult.insertId;

    // If donation types are provided, insert them into CampaignDonationTypes
    // If donation types are provided, insert them into CampaignDonationTypes
    if (donationTypes && donationTypes.length > 0) {
      // First, get the IDs for the donation type names
      const [typeRows] = await pool.query(
        `SELECT donation_type_id, name FROM DonationTypes WHERE name IN (?)`,
        [donationTypes]
      );

      if (typeRows.length > 0) {
        // Map each ID to the campaign
        const values = typeRows.map((row) => [
          campaignId,
          row.donation_type_id,
        ]);

        // Bulk insert into CampaignDonationTypes
        await pool.query(
          `INSERT INTO CampaignDonationTypes (campaign_id, donation_type_id) VALUES ?`,
          [values]
        );
      }
    }

    res.status(201).json({
      message: "Campaign created successfully",
      campaign_id: campaignId,
    });
  } catch (err) {
    console.error("Error creating campaign:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    // Fetch campaigns with organization info
    const query = `
      SELECT 
        c.campaign_id,
        c.title,
        c.description,
        c.fundraising_goal AS goal_amount,
        c.start_date,
        c.raised_amount,
        c.end_date,
        c.status,
        c.category,
        c.location,
        c.emergency,
        c.donors,
        c.tag,
        c.image_url AS image,
        o.name AS organization_name
      FROM Campaigns c
      JOIN Organizations o ON c.organization_id = o.organization_id
    `;

    const [campaigns] = await pool.query(query);

    if (campaigns.length === 0) {
      return res.status(200).json({ message: "No campaigns found", campaigns: [] });
    }

    // Get donation types for all campaigns
    const campaignIds = campaigns.map(c => c.campaign_id);
    const [donationRows] = await pool.query(
      `
      SELECT cdt.campaign_id, dt.name AS donation_type
      FROM CampaignDonationTypes cdt
      JOIN DonationTypes dt ON cdt.donation_type_id = dt.donation_type_id
      WHERE cdt.campaign_id IN (?)
      `,
      [campaignIds]
    );

    // Map donation types to campaigns
    const donationMap = {};
    donationRows.forEach(row => {
      if (!donationMap[row.campaign_id]) donationMap[row.campaign_id] = [];
      donationMap[row.campaign_id].push(row.donation_type);
    });

    const campaignsWithDonations = campaigns.map(c => ({
      ...c,
      organization_name: decrypt(c.organization_name),
      donationTypes: donationMap[c.campaign_id] || []
    }));

    res.status(200).json({
      message: "Campaigns fetched successfully",
      campaigns: campaignsWithDonations,
    });
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};


export const getCampaignsByOrg = async (req, res) => {
  try {
    const  organization_id  = req.params.id; // or req.query.organization_id

    if (!organization_id) {
      return res.status(400).json({ message: "organization_id is required" });
    }

    // Fetch campaigns for this organization
    const [campaigns] = await pool.query(
      `
      SELECT 
        c.campaign_id,
        c.title,
        c.description,
        c.fundraising_goal AS goal_amount,
        c.raised_amount,
        c.start_date,
        c.end_date,
        c.status,
        c.category,
        c.location,
        c.emergency,
        c.tag,
        c.image_url AS image,
        c.donors,
        o.name AS organization_name
      FROM Campaigns c
      JOIN Organizations o ON c.organization_id = o.organization_id
      WHERE c.organization_id = ?
      `,
      [organization_id]
    );

    if (campaigns.length === 0) {
      return res.status(200).json({ 
        message: "No campaigns found", 
        campaigns: [], 
        summary: { total_active_campaigns: 0, total_raised: 0, total_donors: 0 } 
      });
    }



    // Fetch donation types for campaigns
    const campaignIds = campaigns.map(c => c.campaign_id);
    const [donationRows] = await pool.query(
      `
      SELECT cdt.campaign_id, dt.name AS donation_type
      FROM CampaignDonationTypes cdt
      JOIN DonationTypes dt ON cdt.donation_type_id = dt.donation_type_id
      WHERE cdt.campaign_id IN (?)
      `,
      [campaignIds]
    );

    const donationMap = {};
    donationRows.forEach(row => {
      if (!donationMap[row.campaign_id]) donationMap[row.campaign_id] = [];
      donationMap[row.campaign_id].push(row.donation_type);
    });

    const campaignsWithDonations = campaigns.map(c => ({
      ...c,
      organization_name: decrypt(c.organization_name),
      donationTypes: donationMap[c.campaign_id] || []
    }));

    // Calculate summary statistics
    const total_active_campaigns = campaigns.filter(c => c.status === 'Active').length;
    const total_raised = campaigns.reduce((sum, c) => sum + (c.raised_amount || 0), 0);
    const total_donors = campaigns.reduce((sum, c) => sum + (c.donors || 0), 0);

    

    res.status(200).json({
      message: "Campaigns fetched successfully",
      campaigns: campaignsWithDonations,
      summary: { total_active_campaigns, total_raised, total_donors },
    });

  } catch (err) {
    console.error("Error fetching campaigns by organization:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Fetch campaign with organization info
    const query = `
      SELECT 
        c.campaign_id,
        c.title,
        c.description,
        c.fundraising_goal AS goal_amount,
        c.raised_amount,
        c.start_date,
        c.end_date,
        c.status,
        c.category,
        c.location,
        c.emergency,
        c.tag,
        c.image_url AS image,
        o.name AS organization_name
      FROM Campaigns c
      JOIN Organizations o ON c.organization_id = o.organization_id
      WHERE c.campaign_id = ?
    `;

    const [campaignRows] = await pool.query(query, [id]);

    if (campaignRows.length === 0) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const campaign = campaignRows[0];

    // 2️⃣ Fetch donation types for this campaign
    const [donationRows] = await pool.query(
      `
      SELECT dt.name AS donation_type
      FROM CampaignDonationTypes cdt
      JOIN DonationTypes dt ON cdt.donation_type_id = dt.donation_type_id
      WHERE cdt.campaign_id = ?
      `,
      [id]
    );

    const donationTypes = donationRows.map(row => row.donation_type);

    // 3️⃣ Return campaign with donation types
    res.status(200).json({
      message: "Campaign fetched successfully",
      campaign: { ...campaign, donationTypes },
    });

  } catch (err) {
    console.error("Error fetching campaign by ID:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};