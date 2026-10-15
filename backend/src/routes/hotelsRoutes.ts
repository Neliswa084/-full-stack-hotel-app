import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {getAllHotels , getHotelById , addHotel , deleteHotel ,editHotel} from "../controllers/hotelController";
import { addRoom, getRoomsByHotel } from "../controllers/roomController";
import { getImagesByHotel, addImage } from "../controllers/hotelImagesController";
import { getHotelAmenities, updateHotelAmenities } from "../controllers/amenitiesController";

const router = Router();

router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.post("/", protect, adminOnly, addHotel);
router.delete("/:id", protect, adminOnly, deleteHotel);
router.put("/:id", protect, adminOnly, editHotel);

//Rooms
router.get("/:id/rooms", getRoomsByHotel);
router.post("/:id/rooms" , protect ,adminOnly, addRoom)

//Images 

router.get("/:id/images", getImagesByHotel);
router.post("/:id/images", protect, adminOnly, addImage);


//Amenities

router.get("/:id/amenities", getHotelAmenities);
router.put("/:id/amenities", protect, adminOnly, updateHotelAmenities);


export default router;
    


