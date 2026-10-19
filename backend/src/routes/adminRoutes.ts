import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getDashboardStats } from "../controllers/adminController";

const router = Router();

router.get("/stats", protect, adminOnly, getDashboardStats);

export default router;