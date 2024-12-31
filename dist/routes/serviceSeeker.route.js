"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceSeeker_controller_1 = require("../controllers/serviceSeeker.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// login
router.post("/login", serviceSeeker_controller_1.login);
router.post("/login/verify-otp", serviceSeeker_controller_1.verifyLoginOtp);
router.post('/call-event', (0, authMiddleware_1.authMiddleware)(process.env.SEEKER_JWT_SECRET), serviceSeeker_controller_1.createCallEvent);
exports.default = router;
