"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceProvider_controller_1 = require("../../controllers/provider/serviceProvider.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const multerMiddleware_1 = require("../../middlewares/multerMiddleware");
const router = express_1.default.Router();
// onboarding routes
// user onboarding routes
router.post("/onboard/user/mobile", serviceProvider_controller_1.initiateOnboarding);
router.post("/onboard/user/verify-otp", serviceProvider_controller_1.verifyOtp);
router.post("/onboard/user/profile", multerMiddleware_1.multerMiddleware.single('img'), (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), multerMiddleware_1.handleMulterError, serviceProvider_controller_1.updateProfile);
// login
router.post("/login", serviceProvider_controller_1.login);
router.post("/login/verify-otp", serviceProvider_controller_1.verifyLoginOtp);
exports.default = router;
