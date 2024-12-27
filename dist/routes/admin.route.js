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
router.get("/service-providers", authMiddleware_1.authAdminMiddleware, admin_controller_1.getServiceProviders);
router.get("/service-providers/:status", authMiddleware_1.authAdminMiddleware, admin_controller_1.getServiceProvidersByStatus);
router.post("/service-providers/:id/verify", authMiddleware_1.authAdminMiddleware, admin_controller_1.verifyServiceProvider);
router.post("/service-providers/:id/reject", authMiddleware_1.authAdminMiddleware, admin_controller_1.rejectServiceProvider);
// admin service seeker routes
router.get("/service-seekers", authMiddleware_1.authAdminMiddleware, admin_controller_1.getServiceSeekers);
exports.default = router;
