import { pool } from "../server.js";

export const createCampaign = async (req, res) => {
  const {
    organization_id,
    emergency,
    title,
    description,
    goal_amount,
    start_date,
    end_date,
    status,
    category,
  } = req.body;

  // Basic validation
  if (!organization_id || !title || !goal_amount) {
    return res
      .status(400)
      .json({
        message: "organization_id, title, and goal_amount are required",
      });
  }

  const query = `
        INSERT INTO Campaigns
        (organization_id, emergency, title, description, goal_amount, start_date, end_date, status, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const values = [
    organization_id,
    emergency || false,
    title,
    description || null,
    goal_amount,
    start_date || null,
    end_date || null,
    status || "active",
    category || null,
  ];

  await pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Error creating campaign:", err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
    res.status(201).json({
      message: "Campaign created successfully",
      campaign_id: result.insertId,
    });
  });
};

export const getCampaigns = async (req, res) => {
  try {
    const query = `
        SELECT 
            c.campaign_id,
            c.title,
            c.description,
            c.goal_amount,
            c.current_amount,
            c.start_date,
            c.end_date,
            c.status,
            c.category,
            o.name AS organization_name
        FROM Campaigns c
        JOIN Organizations o
        ON c.organization_id = o.organization_id
    `;

    const [results] = await pool.query(query);

    res.status(200).json({
      message: "Campaigns fetched successfully",
      campaigns: results,
    });
  } catch (err) {
    console.error("Error fetching campaigns with org:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};
