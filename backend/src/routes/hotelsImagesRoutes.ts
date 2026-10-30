import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { editImage, deleteImage } from "../controllers/hotelImagesController";

const router = Router();

router.put("/:id", protect, adminOnly, editImage);
router.delete("/:id", protect, adminOnly, deleteImage);

export default router;