import express from "express";
import {
    initiateOnboarding,
    verifyOtp,
    updateProfile,
    login,
    verifyLoginOtp
} from "../controllers/serviceProvider.controller";
import { handleMulterError, multerMiddleware } from '../middlewares/multerMiddleware';
import { authServiceProviderMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// onboarding routes

// user onboarding routes
router.post("/onboard/user/mobile", initiateOnboarding);
router.post("/onboard/user/verify-otp", verifyOtp);
router.post("/onboard/user/profile", authServiceProviderMiddleware, multerMiddleware, handleMulterError, updateProfile);

// login
router.post("/login", login);
router.post("/login/verify-otp", verifyLoginOtp);

// business onboarding routes


export default router;
