"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const common_controller_1 = require("../controllers/common.controller");
const router = express_1.default.Router();
router.get("/service-providers/:id", common_controller_1.getServiceProviderById);
router.get("/service-seekers/:id", common_controller_1.getServiceSeekerById);
router.get("/business/user/:userId", common_controller_1.getBusinessesByUserId);
router.get("/business/:id", common_controller_1.getBusinessById);
router.get("/products/:category", common_controller_1.getProductsByCategory);
exports.default = router;
