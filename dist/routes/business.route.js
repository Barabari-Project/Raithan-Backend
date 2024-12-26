"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const business_controller_1 = require("../controllers/business.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.authServiceProviderMiddleware, business_controller_1.createBusiness);
router.put("/:id", authMiddleware_1.authServiceProviderMiddleware, business_controller_1.updateBusiness);
exports.default = router;
