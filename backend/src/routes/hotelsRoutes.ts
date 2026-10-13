import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {getAllHotels , getHotelById , addHotel , deleteHotel ,editHotel} from "../controllers/hotelController";

const router = Router();

router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.post("/", protect, adminOnly, addHotel);
router.delete("/:id", protect, adminOnly, deleteHotel);
router.put("/:id", protect, adminOnly, editHotel);



export default router;
    