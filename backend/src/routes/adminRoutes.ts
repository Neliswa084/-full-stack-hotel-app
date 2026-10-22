import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getDashboardStats  , getAdminHotels ,getAdminUsers ,changeUserStatus} from "../controllers/adminController";

const router = Router();

//stats card showing numbers of accomadation , users and hotels that exist
router.get("/stats", protect, adminOnly, getDashboardStats);

//Hotels 
router.get("/hotels", protect, adminOnly, getAdminHotels);

//users 
router.get("/users", protect, adminOnly, getAdminUsers);
router.patch("/users/:id/status", protect, adminOnly, changeUserStatus);

export default router;