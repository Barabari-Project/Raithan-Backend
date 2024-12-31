"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductsByStatus = exports.getProductsByCategory = exports.getServiceSeekerById = exports.getBusinessesByUserId = exports.getBusinessById = exports.getServiceProviderById = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const mongoose_1 = require("mongoose");
const http_errors_1 = __importDefault(require("http-errors"));
const serviceProvider_model_1 = __importDefault(require("../models/serviceProvider.model"));
const serviceSeeker_model_1 = __importDefault(require("../models/serviceSeeker.model"));
const business_model_1 = require("../models/business.model");
const business_types_1 = require("../types/business.types");
const harvestorProduct_model_1 = require("../models/products/harvestorProduct.model");
const ImplementProduct_model_1 = require("../models/products/ImplementProduct.model");
const MachineProduct_model_1 = require("../models/products/MachineProduct.model");
const MechanicProduct_model_1 = require("../models/products/MechanicProduct.model");
const DroneProduct_model_1 = require("../models/products/DroneProduct.model");
const AgricultureLaborProduct_model_1 = require("../models/products/AgricultureLaborProduct.model");
const PaddyTransplantorProduct_model_1 = require("../models/products/PaddyTransplantorProduct.model");
const earthMoverProduct_model_1 = require("../models/products/earthMoverProduct.model");
const product_types_1 = require("../types/product.types");
const __1 = require("..");
const formatImageUrl_1 = require("../utils/formatImageUrl");
exports.getServiceProviderById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validate the id parameter
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw (0, http_errors_1.default)(400, "Invalid service provider ID");
    }
    const serviceProvider = yield serviceProvider_model_1.default.findById(id).populate('business');
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    res.status(200).json({ serviceProvider });
}));
// Get a business by ID
exports.getBusinessById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const business = yield business_model_1.Business.findById(req.params.id);
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        throw (0, http_errors_1.default)(400, 'Invalid business ID');
    }
    if (!business) {
        throw (0, http_errors_1.default)(404, 'Business not found');
    }
    res.status(200).json({ business });
}));
exports.getBusinessesByUserId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(userId)) {
        throw (0, http_errors_1.default)(400, 'Invalid User ID');
    }
    // Find businesses by userId
    const business = yield business_model_1.Business.findOne({ serviceProvider: userId }).populate('serviceProvider');
    if (!business) {
        throw (0, http_errors_1.default)(404, 'No businesses found for the given userId');
    }
    res.status(200).json({
        business,
    });
}));
exports.getServiceSeekerById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw (0, http_errors_1.default)(400, "Invalid service seeker ID");
    }
    const serviceSeeker = yield serviceSeeker_model_1.default.findById(id);
    if (!serviceSeeker) {
        throw (0, http_errors_1.default)(404, "Service seeker not found");
    }
    res.status(200).json({ serviceSeeker });
}));
exports.getProductsByCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    __1.logger.info("getProductsByCategory");
    const { category } = req.params;
    __1.logger.info(category);
    const products = yield (0, exports.findProductsByStatus)(category, product_types_1.ProductStatus.VERIFIED);
    res.status(200).json({ products });
}));
const findProductsByStatus = (category, status) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Object.values(business_types_1.BusinessCategory).includes(category)) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    const modelMapping = {
        [business_types_1.BusinessCategory.HARVESTORS]: harvestorProduct_model_1.HarvestorProduct,
        [business_types_1.BusinessCategory.IMPLEMENTS]: ImplementProduct_model_1.ImplementProduct,
        [business_types_1.BusinessCategory.MACHINES]: MachineProduct_model_1.MachineProduct,
        [business_types_1.BusinessCategory.MECHANICS]: MechanicProduct_model_1.MechanicProduct,
        [business_types_1.BusinessCategory.PADDY_TRANSPLANTORS]: PaddyTransplantorProduct_model_1.PaddyTransplantorProduct,
        [business_types_1.BusinessCategory.AGRICULTURE_LABOR]: AgricultureLaborProduct_model_1.AgricultureLaborProduct,
        [business_types_1.BusinessCategory.EARTH_MOVERS]: earthMoverProduct_model_1.EarthMoverProduct,
        [business_types_1.BusinessCategory.DRONES]: DroneProduct_model_1.DroneProduct,
    };
    const model = modelMapping[category];
    if (!model) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    const products = yield model.find({ verificationStatus: status });
    for (const product of products) {
        yield (0, formatImageUrl_1.formatProductImageUrls)(product);
    }
    return products;
});
exports.findProductsByStatus = findProductsByStatus;
