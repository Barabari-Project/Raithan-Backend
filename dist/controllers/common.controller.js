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
exports.getServiceSeekerById = exports.getBusinessesByUserId = exports.getBusinessById = exports.getServiceProviderById = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const mongoose_1 = require("mongoose");
const http_errors_1 = __importDefault(require("http-errors"));
const serviceProvider_model_1 = __importDefault(require("../models/serviceProvider.model"));
const serviceSeeker_model_1 = __importDefault(require("../models/serviceSeeker.model"));
const business_model_1 = require("../models/business.model");
exports.getServiceProviderById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Validate the id parameter
    if (!(0, mongoose_1.isValidObjectId)(id)) {
        throw (0, http_errors_1.default)(400, "Invalid service provider ID");
    }
    const serviceProvider = yield serviceProvider_model_1.default.findById(id);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    res.status(200).json(serviceProvider);
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
    res.status(200).json({ success: true, business });
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
        success: true,
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
    res.status(200).json(serviceSeeker);
}));