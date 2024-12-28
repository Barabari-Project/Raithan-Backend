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
exports.verifyProduct = exports.getServiceSeekers = exports.rejectServiceProvider = exports.verifyServiceProvider = exports.getServiceProvidersByStatus = exports.getServiceProviders = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const validation_1 = require("../utils/validation");
const jwt_1 = require("../utils/jwt");
const serviceProvider_model_1 = __importDefault(require("../models/serviceProvider.model"));
const mongoose_1 = require("mongoose");
const provider_types_1 = require("../types/provider.types");
const serviceSeeker_model_1 = __importDefault(require("../models/serviceSeeker.model"));
const business_types_1 = require("../types/business.types");
const business_model_1 = require("../models/business.model");
const harvestorProduct_model_1 = require("../models/products/harvestorProduct.model");
const ImplementProduct_model_1 = require("../models/products/ImplementProduct.model");
const MachineProduct_model_1 = require("../models/products/MachineProduct.model");
const MechanicProduct_model_1 = require("../models/products/MechanicProduct.model");
const PaddyTransplantorProduct_model_1 = require("../models/products/PaddyTransplantorProduct.model");
const AgricultureLaborProduct_model_1 = require("../models/products/AgricultureLaborProduct.model");
const earthMoverProduct_model_1 = require("../models/products/earthMoverProduct.model");
const DroneProduct_model_1 = require("../models/products/DroneProduct.model");
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!(0, validation_1.validateEmail)(email)) {
        throw (0, http_errors_1.default)(400, "Invalid email format");
    }
    if (email == process.env.EMAIL && password == process.env.PASSWORD) {
        const token = (0, jwt_1.generateJwt)({ userId: process.env.ADMIN_ID }, process.env.ADMIN_JWT_SECRET);
        res.status(200).json({ token });
    }
    else {
        throw (0, http_errors_1.default)(401, "Invalid credentials");
    }
}));
exports.getServiceProviders = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceProviders = yield serviceProvider_model_1.default.find();
    res.status(200).json(serviceProviders);
}));
exports.getServiceProvidersByStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.params;
    // Check if the status is provided
    if (!status) {
        throw (0, http_errors_1.default)(400, "Status query parameter is required.");
    }
    // Validate if the status is a valid value from ServiceProviderStatus enum
    if (!Object.values(provider_types_1.ServiceProviderStatus).includes(status)) {
        throw (0, http_errors_1.default)(400, "Invalid status provided.");
    }
    // Fetch service providers with the valid status
    const serviceProviders = yield serviceProvider_model_1.default.find({ status: { $eq: status } });
    if (serviceProviders.length === 0) {
        throw (0, http_errors_1.default)(404, "No service providers found with the given status.");
    }
    res.status(200).json(serviceProviders);
}));
exports.verifyServiceProvider = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validate the id parameter
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw (0, http_errors_1.default)(400, "Invalid service provider ID");
    }
    const serviceProvider = yield serviceProvider_model_1.default.findById(id);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    if (serviceProvider.status !== provider_types_1.ServiceProviderStatus.COMPLETED) {
        throw (0, http_errors_1.default)(400, "Service provider is not pending verification");
    }
    const updatedServiceProvider = yield serviceProvider_model_1.default.findByIdAndUpdate(id, { status: provider_types_1.ServiceProviderStatus.VERIFIED }, { new: true });
    res.status(200).json({ serviceProvider: updatedServiceProvider });
}));
exports.rejectServiceProvider = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw (0, http_errors_1.default)(400, "Invalid service provider ID");
    }
    const serviceProvider = yield serviceProvider_model_1.default.findById(id);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    if (serviceProvider.status !== provider_types_1.ServiceProviderStatus.COMPLETED) {
        throw (0, http_errors_1.default)(400, "Service provider is not pending verification");
    }
    const updatedServiceProvider = yield serviceProvider_model_1.default.findByIdAndUpdate(id, { status: provider_types_1.ServiceProviderStatus.REJECTED }, { new: true });
    res.status(200).json({ serviceProvider: updatedServiceProvider });
}));
exports.getServiceSeekers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceSeekers = yield serviceSeeker_model_1.default.find();
    res.status(200).json(serviceSeekers);
}));
exports.verifyProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { category } = req.body;
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw (0, http_errors_1.default)(400, "Invalid product ID");
    }
    const userId = req.userId;
    const serviceProvider = yield serviceProvider_model_1.default.findById(userId);
    let product;
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    if (serviceProvider.status !== provider_types_1.ServiceProviderStatus.VERIFIED) {
        throw (0, http_errors_1.default)(400, "Service provider is not verified");
    }
    const business = yield business_model_1.Business.findOne({ serviceProvider: serviceProvider._id });
    if (!business) {
        throw (0, http_errors_1.default)(404, "Business not found");
    }
    if (!business.category.includes(category)) {
        throw (0, http_errors_1.default)(400, "Business does not offer this category");
    }
    if (category === business_types_1.BusinessCategory.HARVESTORS) {
        product = yield harvestorProduct_model_1.HarvestorProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        product.isVerified = true;
        yield product.save();
    }
    else if (category === business_types_1.BusinessCategory.IMPLEMENTS) {
        product = yield ImplementProduct_model_1.ImplementProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        product.isVerified = true;
        yield product.save();
    }
    else if (category === business_types_1.BusinessCategory.MACHINES) {
        product = yield MachineProduct_model_1.MachineProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        product.isVerified = true;
        yield product.save();
    }
    else if (category === business_types_1.BusinessCategory.MECHANICS) {
        product = yield MechanicProduct_model_1.MechanicProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        product.isVerified = true;
        yield product.save();
    }
    else if (category === business_types_1.BusinessCategory.PADDY_TRANSPLANTORS) {
        product = yield PaddyTransplantorProduct_model_1.PaddyTransplantorProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        product.isVerified = true;
        yield product.save();
    }
    else if (category === business_types_1.BusinessCategory.AGRICULTURE_LABOR) {
        product = yield AgricultureLaborProduct_model_1.AgricultureLaborProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        product.isVerified = true;
        yield product.save();
    }
    else if (category === business_types_1.BusinessCategory.EARTH_MOVERS) {
        product = yield earthMoverProduct_model_1.EarthMoverProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        product.isVerified = true;
        yield product.save();
    }
    else if (category === business_types_1.BusinessCategory.DRONES) {
        product = yield DroneProduct_model_1.DroneProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        product.isVerified = true;
        yield product.save();
    }
    res.status(200).json({ product });
}));
