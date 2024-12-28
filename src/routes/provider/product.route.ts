import express from "express";
import { createProduct } from "../../controllers/provider/product.controller";
import { authServiceProviderMiddleware } from "../../middlewares/authMiddleware";
// import { multerMiddleware } from "../../middlewares/multerMiddleware";
import { handleMulterError, multerMiddleware } from "../../middlewares/multerMiddleware";

const router = express.Router();

router.post("/create",
    authServiceProviderMiddleware,
    multerMiddleware.array('images', 6),
    handleMulterError,
    createProduct
);

export default router;