import express from "express";
import { createBusiness, getBusinessById, updateBusiness } from "../controllers/business.controller";
import { getBusinessesByUserId } from "../controllers/business.controller";
import { authServiceProviderMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authServiceProviderMiddleware, createBusiness);
router.get("/user/:userId", getBusinessesByUserId);
router.put("/:id", authServiceProviderMiddleware, updateBusiness);
router.get("/:id", getBusinessById);

export default router;  
