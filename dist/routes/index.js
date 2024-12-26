"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceProvider_route_1 = __importDefault(require("./serviceProvider.route"));
const admin_route_1 = __importDefault(require("./admin.route"));
const serviceSeeker_route_1 = __importDefault(require("./serviceSeeker.route"));
const business_route_1 = __importDefault(require("./business.route"));
const common_route_1 = __importDefault(require("./common.route"));
const router = (0, express_1.Router)();
router.use('/service-providers', serviceProvider_route_1.default);
router.use('/admin', admin_route_1.default);
router.use('/service-seekers', serviceSeeker_route_1.default);
router.use('/business', business_route_1.default);
router.use(common_route_1.default);
exports.default = router;
