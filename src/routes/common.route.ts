import express from "express";
import { getBusinessById, getBusinessesByUserId, getProductsByCategory, getServiceProviderById, getServiceSeekerById } from "../controllers/common.controller";

const router = express.Router();

router.get("/service-providers/:id", getServiceProviderById);
router.get("/service-seekers/:id", getServiceSeekerById);
router.get("/business/user/:userId", getBusinessesByUserId);
router.get("/business/:id", getBusinessById);
router.get("/products/:category", getProductsByCategory);

export default router;