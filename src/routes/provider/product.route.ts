import express from "express";
import { createProduct } from "../../controllers/provider/product.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { handleMulterError, multerMiddleware } from "../../middlewares/multerMiddleware";

const router = express.Router();

router.post("/create",
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    multerMiddleware.array('images', 6),
    handleMulterError,
    createProduct
);

export default router;