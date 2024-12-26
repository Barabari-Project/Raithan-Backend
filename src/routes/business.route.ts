import express from "express";
import { createBusiness,  updateBusiness } from "../controllers/business.controller";
import { authServiceProviderMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authServiceProviderMiddleware, createBusiness);
router.put("/:id", authServiceProviderMiddleware, updateBusiness);

export default router;  
