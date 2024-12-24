import express from "express";
import {
    initiateOnboarding,
    verifyOtp,
    // addEmailAndPassword,
    updateProfile,
} from "../controllers/serviceProvider.controller";
import { handleMulterError, multerMiddleware } from '../middlewares/multerMiddleware';
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/onboard/mobile", initiateOnboarding);
router.post("/onboard/verify-otp", verifyOtp);
// router.post("/onboard/email", authMiddleware, addEmailAndPassword);
router.post("/onboard/profile", authMiddleware, multerMiddleware, handleMulterError, updateProfile);

export default router;
