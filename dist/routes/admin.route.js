"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const common_controller_1 = require("../controllers/common.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// admin auth routes
router.post("/auth/login", admin_controller_1.login);
// admin service provider routes
router.get("/service-providers", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getServiceProviders);
router.get("/service-providers/:status", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getServiceProvidersByStatus);
router.put("/service-providers/:id/status", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.updateServiceProviderStatus);
router.put("/service-providers/block/:id", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.blockServiceProvider);
router.put("/service-providers/unblock/:id", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.unblockServiceProvider);
// verify product
router.put("/products/:category/:id/status", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.updateProductStatus);
router.get("/products", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getProductByStatusAndCategoryAndBusinessId);
// admin service seeker routes
router.get("/service-seekers", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getServiceSeekers);
router.get("/service-seekers/:id", (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), common_controller_1.getServiceSeekerById);
router.get('/call-history', (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getCallHistory);
router.get('/call-history/service-seeker/:id', (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getCallHistoryByServiceSeekerId);
router.get('/call-history/service-provider/:id', (0, authMiddleware_1.authMiddleware)(process.env.ADMIN_JWT_SECRET), admin_controller_1.getCallHistoryByServiceProviderId);
exports.default = router;
