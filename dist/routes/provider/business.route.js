"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const business_controller_1 = require("../../controllers/provider/business.controller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/", (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), business_controller_1.createBusiness);
router.put("/:id", (0, authMiddleware_1.authMiddleware)(process.env.PROVIDER_JWT_SECRET), business_controller_1.updateBusiness);
exports.default = router;
