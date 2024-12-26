import express from "express";
import { getServiceProviderById, getServiceProviders, getServiceProvidersPendingVerification, getServiceSeekerById, getServiceSeekers, login, rejectServiceProvider, verifyServiceProvider } from "../controllers/admin.controller";
import { authAdminMiddleware, authSeekerMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// admin auth routes
router.post("/auth/login", login);

// admin service provider routes
router.get("/service-providers", authAdminMiddleware, getServiceProviders);
router.get("/service-providers/pending-verification", authAdminMiddleware, getServiceProvidersPendingVerification);
router.post("/service-providers/:id/verify", authAdminMiddleware, verifyServiceProvider);
router.post("/service-providers/:id/reject", authAdminMiddleware, rejectServiceProvider);
router.get("/service-providers/:id", authAdminMiddleware, getServiceProviderById);


// admin service seeker routes
router.get("/service-seekers", authAdminMiddleware, getServiceSeekers);
router.get("/service-seekers/:id", authAdminMiddleware, getServiceSeekerById);

export default router;