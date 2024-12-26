import express from "express";
import { login, verifyLoginOtp } from "../controllers/serviceSeeker.controller";

const router = express.Router();

// login
router.post("/login", login);
router.post("/login/verify-otp", verifyLoginOtp);

export default router;