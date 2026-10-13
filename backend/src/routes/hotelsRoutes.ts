import { Router } from "express";
import {getAllHotels , getHotelById} from "../controllers/hotelController";

const router = Router();

router.get("/", getAllHotels);
router.get("/hotels/:id", getHotelById);


export default router;
    