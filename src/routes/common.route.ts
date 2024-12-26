import express from "express";
import { getBusinessesByUserId, getServiceSeekerById, getServiceProviderById, getBusinessById } from "../controllers/common.controller";

const router = express.Router();

router.get("/service-providers/:id", getServiceProviderById);
router.get("/service-seekers/:id", getServiceSeekerById);
router.get("/business/user/:userId", getBusinessesByUserId);
router.get("/business/:id", getBusinessById);

export default router;