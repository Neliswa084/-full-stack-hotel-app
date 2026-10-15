import { Router } from "express";
import { getAllAmenities } from "../controllers/amenitiesController";

const router = Router();

router.get("/", getAllAmenities);

export default router;