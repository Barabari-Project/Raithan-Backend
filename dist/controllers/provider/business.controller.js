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
exports.updateBusiness = exports.setLocation = exports.createBusiness = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const business_model_1 = require("../../models/business.model");
const serviceProvider_model_1 = __importDefault(require("../../models/serviceProvider.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const provider_types_1 = require("../../types/provider.types");
// Create a new business
exports.createBusiness = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceProvider = yield serviceProvider_model_1.default.findById(req.userId);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, 'Service Provider not found');
    }
    if (serviceProvider.status !== provider_types_1.ServiceProviderStatus.BUSINESS_DETAILS_REMAINING) {
        throw (0, http_errors_1.default)(400, 'Service Provider is not in business details remaining state');
    }
    const isBusinessAlreadyExists = yield business_model_1.Business.findOne({ serviceProvider: serviceProvider._id });
    if (isBusinessAlreadyExists) {
        throw (0, http_errors_1.default)(400, 'Business already exists');
    }
    const newBusiness = new business_model_1.Business(Object.assign(Object.assign({}, req.body), { serviceProvider: serviceProvider._id }));
    yield newBusiness.save();
    serviceProvider.business = newBusiness._id;
    serviceProvider.status = provider_types_1.ServiceProviderStatus.VERIFICATION_REQUIRED;
    yield serviceProvider.save();
    res.status(201).json({
        success: true,
        message: 'Business created successfully',
        business: newBusiness,
    });
}));
exports.setLocation = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, lng } = req.body;
    const userId = req.userId;
    const provider = yield serviceProvider_model_1.default.findById(userId);
    yield business_model_1.Business.findByIdAndUpdate(provider === null || provider === void 0 ? void 0 : provider.business, { $set: { location: { lat, lng } } }, { runValidators: true });
    res.json({ message: 'Location updated Successfully!' }).status(200);
}));
// Update a business by ID
exports.updateBusiness = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceProvider = yield serviceProvider_model_1.default.findById(req.userId);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, 'Service Provider not found');
    }
    if ((serviceProvider.status !== provider_types_1.ServiceProviderStatus.VERIFICATION_REQUIRED &&
        serviceProvider.status !== provider_types_1.ServiceProviderStatus.MODIFICATION_REQUIRED &&
        serviceProvider.status !== provider_types_1.ServiceProviderStatus.VERIFIED &&
        serviceProvider.status !== provider_types_1.ServiceProviderStatus.RE_VERIFICATION_REQUIRED)) {
        throw (0, http_errors_1.default)(400, "You can not update a business details");
    }
    const updatedBusiness = yield business_model_1.Business.findByIdAndUpdate(serviceProvider.business, { $set: Object.assign(Object.assign({}, req.body), { serviceProvider: req.userId }) }, { new: true, runValidators: true });
    if (serviceProvider.status == provider_types_1.ServiceProviderStatus.VERIFIED || serviceProvider.status == provider_types_1.ServiceProviderStatus.MODIFICATION_REQUIRED) {
        serviceProvider.status = provider_types_1.ServiceProviderStatus.RE_VERIFICATION_REQUIRED;
        yield serviceProvider.save();
    }
    res.status(200).json({
        success: true,
        message: 'Business updated successfully',
        business: updatedBusiness,
    });
}));
