import express from "express";
import { getServiceProviders, getServiceProvidersByStatus, getServiceSeekers, login, rejectServiceProvider, verifyServiceProvider } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// admin auth routes
router.post("/auth/login", login);

// admin service provider routes
router.get("/service-providers", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceProviders);
router.get("/service-providers/:status", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceProvidersByStatus);
router.post("/service-providers/:id/verify", authMiddleware(process.env.ADMIN_JWT_SECRET!), verifyServiceProvider);
router.post("/service-providers/:id/reject", authMiddleware(process.env.ADMIN_JWT_SECRET!), rejectServiceProvider);


// admin service seeker routes
router.get("/service-seekers", authMiddleware(process.env.ADMIN_JWT_SECRET!), getServiceSeekers);


export default router;