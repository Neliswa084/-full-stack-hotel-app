import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getAllRooms } from "../controllers/roomController";


const router = Router ();

router.get("/", getAllRooms);


export default router;
