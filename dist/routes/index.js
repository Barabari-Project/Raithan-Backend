"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceProvider_route_1 = __importDefault(require("./serviceProvider.route"));
const router = (0, express_1.Router)();
router.use('/service-provider', serviceProvider_route_1.default);
exports.default = router;