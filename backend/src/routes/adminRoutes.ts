import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getDashboardStats  , getAdminHotels} from "../controllers/adminController";

const router = Router();

router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/hotels", protect, adminOnly, getAdminHotels);

export default router;