"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceProvider_controller_1 = require("../controllers/serviceProvider.controller");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// onboarding routes
// user onboarding routes
router.post("/onboard/user/mobile", serviceProvider_controller_1.initiateOnboarding);
router.post("/onboard/user/verify-otp", serviceProvider_controller_1.verifyOtp);
// router.post("/onboard/user/email", authMiddleware, addEmailAndPassword);
router.post("/onboard/user/profile", authMiddleware_1.authServiceProviderMiddleware, multerMiddleware_1.multerMiddleware, multerMiddleware_1.handleMulterError, serviceProvider_controller_1.updateProfile);
// business onboarding routes
exports.default = router;