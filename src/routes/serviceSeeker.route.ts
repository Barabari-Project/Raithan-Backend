import express from "express";
import { createCallEvent, getProductsByDistanceAndHp, login, verifyLoginOtp } from "../controllers/serviceSeeker.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// login
router.post("/login", login);
router.post("/login/verify-otp", verifyLoginOtp);

router.post('/call-event', authMiddleware(process.env.SEEKER_JWT_SECRET!), createCallEvent);

router.post('/get-products', getProductsByDistanceAndHp);

export default router;