import { Router } from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {
    addBooking, getMyBookings, getBookingById, cancelMyBooking,
    getAllBookings, changeBookingStatus
} from "../controllers/bookingController";

const router = Router();

// Guest 
router.post("/", protect, addBooking);
router.get("/my", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelMyBooking);

// Admin
router.get("/", protect, adminOnly, getAllBookings);
router.patch("/:id/status", protect, adminOnly, changeBookingStatus);

// Guest or admin
router.get("/:id", protect, getBookingById);

export default router;