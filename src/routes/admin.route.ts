import express from "express";
import { blockServiceProvider, getCallHistory, getCallHistoryByServiceProviderId, getCallHistoryByServiceSeekerId, getProductByStatusAndCategoryAndBusinessId, getServiceProviders, getServiceProvidersByStatus, getServiceSeekers, login, unblockServiceProvider, updateProductStatus, updateServiceProviderStatus } from "../controllers/admin.controller";
import { getServiceSeekerById } from "../controllers/common.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// admin auth routes
router.post("/auth/login", login);

// admin service provider routes
router.get("/service-providers", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceProviders);
router.get("/service-providers/:status", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceProvidersByStatus);
router.put("/service-providers/:id/status", authMiddleware(process.env.ADMIN_JWT_SECRET!), updateServiceProviderStatus);

router.put("/service-providers/block/:id", authMiddleware(process.env.ADMIN_JWT_SECRET!), blockServiceProvider);

router.put("/service-providers/unblock/:id", authMiddleware(process.env.ADMIN_JWT_SECRET!), unblockServiceProvider);

// verify product
router.put("/products/:category/:id/status", authMiddleware(process.env.ADMIN_JWT_SECRET!), updateProductStatus);
router.get("/products", authMiddleware(process.env.ADMIN_JWT_SECRET!), getProductByStatusAndCategoryAndBusinessId);

// admin service seeker routes
router.get("/service-seekers", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceSeekers);
router.get("/service-seekers/:id", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceSeekerById);

router.get('/call-history', authMiddleware(process.env.ADMIN_JWT_SECRET!), getCallHistory);
router.get('/call-history/service-seeker/:id', authMiddleware(process.env.ADMIN_JWT_SECRET!), getCallHistoryByServiceSeekerId);
router.get('/call-history/service-provider/:id', authMiddleware(process.env.ADMIN_JWT_SECRET!), getCallHistoryByServiceProviderId);

export default router;