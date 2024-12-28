import express from "express";
import {
    initiateOnboarding,
    login,
    updateProfile,
    verifyLoginOtp,
    verifyOtp
} from "../../controllers/provider/serviceProvider.controller";
import { authServiceProviderMiddleware } from "../../middlewares/authMiddleware";
import { multerMiddlewareForSingleFile } from '../../middlewares/multerMiddleware';

const router = express.Router();

// onboarding routes

// user onboarding routes
router.post("/onboard/user/mobile", initiateOnboarding);
router.post("/onboard/user/verify-otp", verifyOtp);
router.post("/onboard/user/profile",
    multerMiddlewareForSingleFile.single('img'),
    authServiceProviderMiddleware,
    updateProfile
);

// login
router.post("/login", login);
router.post("/login/verify-otp", verifyLoginOtp);

export default router;
