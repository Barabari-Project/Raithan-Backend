import express from "express";
import { createBusiness,  updateBusiness } from "../../controllers/provider/business.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware(process.env.PROVIDER_JWT_SECRET!), createBusiness);
router.put("/", authMiddleware(process.env.PROVIDER_JWT_SECRET!), updateBusiness);

export default router;  
