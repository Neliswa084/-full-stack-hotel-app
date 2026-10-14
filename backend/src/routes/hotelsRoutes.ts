import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {getAllHotels , getHotelById , addHotel , deleteHotel ,editHotel} from "../controllers/hotelController";
import { addRoom, getRoomsByHotel } from "../controllers/roomController";

const router = Router();

router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.post("/", protect, adminOnly, addHotel);
router.delete("/:id", protect, adminOnly, deleteHotel);
router.put("/:id", protect, adminOnly, editHotel);

//Rooms
router.get("/:id/rooms", getRoomsByHotel);
router.post("/:id/rooms" , protect ,adminOnly, addRoom)


export default router;
    