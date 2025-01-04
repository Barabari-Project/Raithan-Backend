import express from "express";
import { createProduct, rateProduct, updateProduct } from "../../controllers/provider/product.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { handleMulterError, multerMiddleware } from "../../middlewares/multerMiddleware";

const router = express.Router();

router.post("/create",
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    multerMiddleware.array('images', 6),
    handleMulterError,
    createProduct
);

router.put('/update',
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    multerMiddleware.array('images', 6),
    handleMulterError,
    updateProduct
);

router.post('/rating',
    authMiddleware(process.env.SEEKER_JWT_SECRET!),
    rateProduct
);

export default router;