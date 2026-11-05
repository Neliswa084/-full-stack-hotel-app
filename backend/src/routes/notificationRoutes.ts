import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import {
    getMyNotifications,
    readNotification,
    readAllNotifications
} from "../controllers/notificationController";

const router = Router();

router.get("/", protect, getMyNotifications);
router.patch("/read-all", protect, readAllNotifications);
router.patch("/:id/read", protect, readNotification);

export default router;