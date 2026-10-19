import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { editReview, deleteReview } from "../controllers/reviewsController";

const router = Router();

router.put("/:id", protect, editReview);
router.delete("/:id", protect, deleteReview);

export default router;