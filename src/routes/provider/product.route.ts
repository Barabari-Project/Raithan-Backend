import express from "express";
import { createProduct } from "../../controllers/provider/product.controller";
import { authServiceProviderMiddleware } from "../../middlewares/authMiddleware";
// import { multerMiddleware } from "../../middlewares/multerMiddleware";

const router = express.Router();

// router.post("/create", authServiceProviderMiddleware, multerMiddleware, createProduct);

export default router;