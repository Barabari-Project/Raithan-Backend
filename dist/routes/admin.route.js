"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// admin auth routes
router.post("/auth/login", admin_controller_1.login);
// admin service provider routes
router.get("/service-providers", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getServiceProviders);
router.get("/service-providers/:status", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getServiceProvidersByStatus);
router.post("/service-providers/:id/verify", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.verifyServiceProvider);
router.post("/service-providers/:id/reject", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.rejectServiceProvider);
// verify product
router.post("/products/:id/verify", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.verifyProduct);
// admin service seeker routes
router.get("/service-seekers", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getServiceSeekers);
exports.default = router;
