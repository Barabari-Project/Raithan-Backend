import express from "express";
import { getServiceProviderById, getServiceProviders, getServiceProvidersPendingVerification, login, rejectServiceProvider, verifyServiceProvider } from "../controllers/admin.controller";
import { authAdminMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// admin auth routes
router.post("/admin/auth/login", login);

// admin service provider routes
router.get("/admin/service-providers", authAdminMiddleware, getServiceProviders);
router.get("/admin/service-providers/pending-verification", authAdminMiddleware, getServiceProvidersPendingVerification);
router.post("/admin/service-providers/:id/verify", authAdminMiddleware, verifyServiceProvider);
router.post("/admin/service-providers/:id/reject", authAdminMiddleware, rejectServiceProvider);
router.get("/admin/service-providers/:id", authAdminMiddleware, getServiceProviderById);

export default router;
