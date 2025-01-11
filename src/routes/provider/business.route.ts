import express from "express";
import { createBusiness, setLocation, updateBusiness } from "../../controllers/provider/business.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware(process.env.PROVIDER_JWT_SECRET!), createBusiness);
router.put("/", authMiddleware(process.env.PROVIDER_JWT_SECRET!), updateBusiness);
router.post('/location',
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    setLocation
);


export default router;  
