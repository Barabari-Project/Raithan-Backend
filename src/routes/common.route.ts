import express from "express";
import { getBusinessesByUserId, getServiceSeekerById, getServiceProviderById, getBusinessById, getProductsByCategory } from "../controllers/common.controller";

const router = express.Router();

router.get("/service-providers/:id", getServiceProviderById);
router.get("/service-seekers/:id", getServiceSeekerById);
router.get("/business/user/:userId", getBusinessesByUserId);
router.get("/business/:id", getBusinessById);
router.get("/products/:category", getProductsByCategory);

export default router;