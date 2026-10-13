import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {getAllHotels , getHotelById , addHotel} from "../controllers/hotelController";

const router = Router();

router.get("/", getAllHotels);
router.get("/hotels/:id", getHotelById);
router.post("/", protect, adminOnly, addHotel);


export default router;
    