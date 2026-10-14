import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getAllRooms , deleteRoom } from "../controllers/roomController";


const router = Router ();

router.get("/", getAllRooms);
router.delete("/:id", protect, adminOnly, deleteRoom);


export default router;
