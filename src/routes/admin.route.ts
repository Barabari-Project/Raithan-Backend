import express from "express";
import { getCallHistory, getCallHistoryByServiceProviderId, getCallHistoryByServiceSeekerId, getProductByStatusAndProviderId, getServiceProviders, getServiceProvidersByStatus, getServiceSeekers, login, rejectProduct, updateServiceProviderStatus, verifyProduct } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getServiceSeekerById } from "../controllers/common.controller";

const router = express.Router();

// admin auth routes
router.post("/auth/login", login);

// admin service provider routes
router.get("/service-providers", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceProviders);
router.get("/service-providers/:status", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceProvidersByStatus);
router.put("/service-providers/:id/status", authMiddleware(process.env.ADMIN_JWT_SECRET!), updateServiceProviderStatus);

// verify product
router.post("/products/:category/:id/verify", authMiddleware(process.env.ADMIN_JWT_SECRET!), verifyProduct);
router.post("/products/:category/:id/reject", authMiddleware(process.env.ADMIN_JWT_SECRET!), rejectProduct);
router.get("/products/:category/:status/:businessId", authMiddleware(process.env.ADMIN_JWT_SECRET!), getProductByStatusAndProviderId);

// admin service seeker routes
router.get("/service-seekers", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceSeekers);
router.get("/service-seekers/:id", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceSeekerById);

router.get('/call-history', authMiddleware(process.env.ADMIN_JWT_SECRET!), getCallHistory);
router.get('/call-history/service-seeker/:id', authMiddleware(process.env.ADMIN_JWT_SECRET!), getCallHistoryByServiceSeekerId);
router.get('/call-history/service-provider/:id', authMiddleware(process.env.ADMIN_JWT_SECRET!), getCallHistoryByServiceProviderId);

export default router;