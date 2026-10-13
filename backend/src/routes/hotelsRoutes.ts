import { Router } from "express";
import {getAllHotels} from "../controllers/hotelController";

const router = Router();

router.get("/hotels", getAllHotels);

export default router;
