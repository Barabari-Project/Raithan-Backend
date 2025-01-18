"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../../controllers/provider/product.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const multerMiddleware_1 = require("../../middlewares/multerMiddleware");
const router = express_1.default.Router();
router.post("/create/vehicle", (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), multerMiddleware_1.multerMiddleware.fields([
    { name: 'front-view', maxCount: 1 },
    { name: 'back-view', maxCount: 1 },
    { name: 'left-view', maxCount: 1 },
    { name: 'right-view', maxCount: 1 },
    { name: 'driving-license', maxCount: 1 }, // Corrected "driving-licences" to "driving-license"
    { name: 'rc-book', maxCount: 1 }
]), multerMiddleware_1.handleMulterError, product_controller_1.createProduct);
router.post("/create/drones", (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), multerMiddleware_1.multerMiddleware.fields([
    { name: 'front-view', maxCount: 1 },
    { name: 'back-view', maxCount: 1 },
    { name: 'left-view', maxCount: 1 },
    { name: 'right-view', maxCount: 1 },
    { name: 'bill', maxCount: 1 },
]), multerMiddleware_1.handleMulterError, product_controller_1.createProduct);
router.post("/create/labour-mechanics", (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), multerMiddleware_1.multerMiddleware.fields([
    { name: 'e-shram-card', maxCount: 1 }, // Corrected "e-sharmcard" to "e-shram-card"
]), multerMiddleware_1.handleMulterError, product_controller_1.createProduct);
router.put("/update/vehicle", (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), multerMiddleware_1.multerMiddleware.fields([
    { name: 'front-view', maxCount: 1 },
    { name: 'back-view', maxCount: 1 },
    { name: 'left-view', maxCount: 1 },
    { name: 'right-view', maxCount: 1 },
    { name: 'driving-license', maxCount: 1 }, // Corrected "driving-licences" to "driving-license"
    { name: 'rc-book', maxCount: 1 }
]), multerMiddleware_1.handleMulterError, product_controller_1.updateProduct);
router.put("/update/drones", (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), multerMiddleware_1.multerMiddleware.fields([
    { name: 'front-view', maxCount: 1 },
    { name: 'back-view', maxCount: 1 },
    { name: 'left-view', maxCount: 1 },
    { name: 'right-view', maxCount: 1 },
    { name: 'bill', maxCount: 1 },
]), multerMiddleware_1.handleMulterError, product_controller_1.updateProduct);
router.put("/update/labour-mechanics", (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), multerMiddleware_1.multerMiddleware.fields([
    { name: 'e-shram-card', maxCount: 1 }, // Corrected "e-sharmcard" to "e-shram-card"
]), multerMiddleware_1.handleMulterError, product_controller_1.updateProduct);
router.post('/rating', (0, authMiddleware_1.authMiddleware)(process.env.SEEKER_JWT_SECRET), product_controller_1.rateProduct);
exports.default = router;
