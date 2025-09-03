import express from "express";
import donorRoutes from "./donor.routes.js";
import orgRoutes from "./org.route.js";


const router = express.Router();
router.use("/org",orgRoutes);
router.use("/donor",donorRoutes);

export default router;