import express from "express";
import donorRoutes from "./donor.routes.js";
import orgRoutes from "./org.route.js";
import authRoutes from "./auth.routes.js";
import campRoutes from "./campaigns.routes.js";

const router = express.Router();

// Authentication routes
router.use("/auth", authRoutes);

// Other routes
router.use("/org", orgRoutes);
router.use("/donor", donorRoutes);
router.use("/campaign",campRoutes);

export default router;