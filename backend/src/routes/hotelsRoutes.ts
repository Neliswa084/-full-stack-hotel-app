import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {getAllHotels , getHotelById , addHotel , deleteHotel} from "../controllers/hotelController";

const router = Router();

router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.post("/", protect, adminOnly, addHotel);
router.delete("/:id", protect, adminOnly, deleteHotel);



export default router;
    