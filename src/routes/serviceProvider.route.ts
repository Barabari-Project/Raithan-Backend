import express from "express";
import {
    initiateOnboarding,
    verifyOtp,
    // addEmailAndPassword,
    updateProfile,
} from "../controllers/serviceProvider.controller";
import { handleMulterError, multerMiddleware } from '../middlewares/multerMiddleware';
import { authServiceProviderMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// onboarding routes

// user onboarding routes
router.post("/onboard/user/mobile", initiateOnboarding);
router.post("/onboard/user/verify-otp", verifyOtp);
// router.post("/onboard/user/email", authMiddleware, addEmailAndPassword);
router.post("/onboard/user/profile", authServiceProviderMiddleware, multerMiddleware, handleMulterError, updateProfile);

// business onboarding routes


export default router;
