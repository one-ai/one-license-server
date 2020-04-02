import { Router } from "express";
import UserRouter from "./Users";
import HealthRouter from "./Health";

// Init router and path
const router = Router();

// Add sub-routes
router.use("/users", UserRouter);
router.use("/health", HealthRouter);

// Export the base-router
export default router;
