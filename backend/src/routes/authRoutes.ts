import {Router} from "express";
import { protect } from "../middleware/authMiddleware";
import { loginUser, registerUser ,updateMyInfo ,googleLogin} from "../controllers/authController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/me", protect, updateMyInfo);
router.post("/google", googleLogin);


export default router; 