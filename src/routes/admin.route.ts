import express from "express";
import { getCallHistory, getCallHistoryByServiceProviderId, getCallHistoryByServiceSeekerId, getServiceProviders, getServiceProvidersByStatus, getServiceSeekers, getUnverifiedProducts, login, rejectProduct, rejectServiceProvider, verifyProduct, verifyServiceProvider } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// admin auth routes
router.post("/auth/login", login);

// admin service provider routes
router.get("/service-providers", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceProviders);
router.get("/service-providers/:status", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceProvidersByStatus);
router.post("/service-providers/:id/verify", authMiddleware(process.env.ADMIN_JWT_SECRET!), verifyServiceProvider);
router.post("/service-providers/:id/reject", authMiddleware(process.env.ADMIN_JWT_SECRET!), rejectServiceProvider);

// verify product
router.post("/products/:category/:id/verify", authMiddleware(process.env.ADMIN_JWT_SECRET!), verifyProduct);
router.post("/products/:category/:id/reject", authMiddleware(process.env.ADMIN_JWT_SECRET!), rejectProduct);
router.get("/products/:category/unverified", authMiddleware(process.env.ADMIN_JWT_SECRET!), getUnverifiedProducts);

// admin service seeker routes
router.get("/service-seekers", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceSeekers);

router.get('/call-history', authMiddleware(process.env.ADMIN_JWT_SECRET!), getCallHistory);
router.get('/call-history/service-seeker/:id', authMiddleware(process.env.ADMIN_JWT_SECRET!), getCallHistoryByServiceSeekerId);
router.get('/call-history/service-provider/:id', authMiddleware(process.env.ADMIN_JWT_SECRET!), getCallHistoryByServiceProviderId);

export default router;