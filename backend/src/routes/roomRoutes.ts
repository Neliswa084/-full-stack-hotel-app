import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { getAllRooms , deleteRoom ,editRoom } from "../controllers/roomController";


const router = Router ();

router.get("/", getAllRooms);
router.delete("/:id", protect, adminOnly, deleteRoom);
router.put("/:id", protect, adminOnly, editRoom);


export default router;
