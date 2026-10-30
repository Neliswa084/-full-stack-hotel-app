import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { initializePayment, verifyPayment } from "../controllers/paymentController";

const router = Router();

router.post("/initialize", protect, initializePayment);
router.get("/verify/:reference", protect, verifyPayment);

export default router;