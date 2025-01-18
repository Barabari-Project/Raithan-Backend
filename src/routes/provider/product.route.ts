import express from "express";
import { createProduct, rateProduct, updateProduct } from "../../controllers/provider/product.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { handleMulterError, multerMiddleware } from "../../middlewares/multerMiddleware";

const router = express.Router();

router.post("/create/vehicle",
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    multerMiddleware.fields([
        { name: 'front-view', maxCount: 1 },
        { name: 'back-view', maxCount: 1 },
        { name: 'left-view', maxCount: 1 },
        { name: 'right-view', maxCount: 1 },
        { name: 'driving-license', maxCount: 1 }, // Corrected "driving-licences" to "driving-license"
        { name: 'rc-book', maxCount: 1 }
    ]),
    handleMulterError,
    createProduct
);

router.post("/create/drones",
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    multerMiddleware.fields([
        { name: 'front-view', maxCount: 1 },
        { name: 'back-view', maxCount: 1 },
        { name: 'left-view', maxCount: 1 },
        { name: 'right-view', maxCount: 1 },
        { name: 'bill', maxCount: 1 },
    ]),
    handleMulterError,
    createProduct
);

router.post("/create/labour-mechanics",
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    multerMiddleware.fields([
        { name: 'e-shram-card', maxCount: 1 }, // Corrected "e-sharmcard" to "e-shram-card"
    ]),
    handleMulterError,
    createProduct
);

router.put("/update/vehicle",
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    multerMiddleware.fields([
        { name: 'front-view', maxCount: 1 },
        { name: 'back-view', maxCount: 1 },
        { name: 'left-view', maxCount: 1 },
        { name: 'right-view', maxCount: 1 },
        { name: 'driving-license', maxCount: 1 }, // Corrected "driving-licences" to "driving-license"
        { name: 'rc-book', maxCount: 1 }
    ]),
    handleMulterError,
    updateProduct
);

router.put("/update/drones",
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    multerMiddleware.fields([
        { name: 'front-view', maxCount: 1 },
        { name: 'back-view', maxCount: 1 },
        { name: 'left-view', maxCount: 1 },
        { name: 'right-view', maxCount: 1 },
        { name: 'bill', maxCount: 1 },
    ]),
    handleMulterError,
    updateProduct
);

router.put("/update/labour-mechanics",
    authMiddleware(process.env.PROVIDER_JWT_SECRET!),
    multerMiddleware.fields([
        { name: 'e-shram-card', maxCount: 1 }, // Corrected "e-sharmcard" to "e-shram-card"
    ]),
    handleMulterError,
    updateProduct
);


router.post('/rating',
    authMiddleware(process.env.SEEKER_JWT_SECRET!),
    rateProduct
);

export default router;