"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../../controllers/provider/product.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
// import { multerMiddleware } from "../../middlewares/multerMiddleware";
const multerMiddleware_1 = require("../../middlewares/multerMiddleware");
const router = express_1.default.Router();
router.post("/create", authMiddleware_1.authServiceProviderMiddleware, multerMiddleware_1.multerMiddleware.array('images', 6), multerMiddleware_1.handleMulterError, product_controller_1.createProduct);
exports.default = router;
