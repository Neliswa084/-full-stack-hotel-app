import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { getMyFavourites, saveFavourite, deleteFavourite } from "../controllers/favouriteController";

const router = Router();

router.get("/", protect, getMyFavourites);
router.post("/:hotelId", protect, saveFavourite);
router.delete("/:hotelId", protect, deleteFavourite);

export default router;