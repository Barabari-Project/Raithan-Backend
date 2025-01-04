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
router.post("/create", (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), multerMiddleware_1.multerMiddleware.array('images', 6), multerMiddleware_1.handleMulterError, product_controller_1.createProduct);
router.put('/update', (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), multerMiddleware_1.multerMiddleware.array('images', 6), multerMiddleware_1.handleMulterError, product_controller_1.updateProduct);
router.post('/rating', (0, authMiddleware_1.authMiddleware)(process.env.SEEKER_JWT_SECRET), product_controller_1.rateProduct);
exports.default = router;
