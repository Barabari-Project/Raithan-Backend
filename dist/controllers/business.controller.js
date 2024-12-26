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
exports.getBusinessesByUserId = exports.updateBusiness = exports.getBusinessById = exports.createBusiness = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const business_model_1 = require("../models/business.model");
const mongoose_1 = require("mongoose");
const serviceProvider_model_1 = __importDefault(require("../models/serviceProvider.model"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const __1 = require("..");
// Create a new business
exports.createBusiness = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceProvider = yield serviceProvider_model_1.default.findById(req.userId);
    __1.logger.debug(req.userId);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, 'Service Provider not found');
    }
    const isBusinessAlreadyExists = yield business_model_1.Business.findOne({ userId: req.userId });
    __1.logger.debug(isBusinessAlreadyExists);
    if (isBusinessAlreadyExists) {
        throw (0, http_errors_1.default)(400, 'Business already exists');
    }
    const newBusiness = new business_model_1.Business(Object.assign(Object.assign({}, req.body), { userId: serviceProvider._id }));
    yield newBusiness.save();
    res.status(201).json({
        success: true,
        message: 'Business created successfully',
        business: newBusiness,
    });
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
// Update a business by ID
exports.updateBusiness = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, mongoose_1.isValidObjectId)(req.params.id)) {
        throw (0, http_errors_1.default)(400, 'Invalid business ID');
    }
    const updatedBusiness = yield business_model_1.Business.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), { userId: req.userId }), { new: true, runValidators: true });
    if (!updatedBusiness) {
        throw (0, http_errors_1.default)(404, 'Business not found');
    }
    res.status(200).json({
        success: true,
        message: 'Business updated successfully',
        business: updatedBusiness,
    });
}));
exports.getBusinessesByUserId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!(0, mongoose_1.isValidObjectId)(userId)) {
        throw (0, http_errors_1.default)(400, 'Invalid User ID');
    }
    // Find businesses by userId
    const business = yield business_model_1.Business.findOne({ userId });
    if (!business) {
        throw (0, http_errors_1.default)(404, 'No businesses found for the given userId');
    }
    res.status(200).json({
        success: true,
        business,
    });
}));
