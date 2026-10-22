import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {addAmenity, getAllAmenities } from "../controllers/amenitiesController";

const router = Router();

router.post("/", protect, adminOnly, addAmenity);
router.get("/", getAllAmenities);

export default router;