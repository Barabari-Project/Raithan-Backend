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
exports.rejectServiceProvider = exports.verifyServiceProvider = exports.getServiceProvidersPendingVerification = exports.getServiceProviderById = exports.getServiceProviders = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const validation_1 = require("../utils/validation");
const jwt_1 = require("../utils/jwt");
const serviceProvider_model_1 = __importDefault(require("../models/serviceProvider.model"));
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
const mongoose_1 = require("mongoose");
const provider_types_1 = require("../types/provider.types");
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
exports.getServiceProvidersPendingVerification = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceProviders = yield serviceProvider_model_1.default.find({ status: provider_types_1.ServiceProviderStatus.COMPLETED });
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
