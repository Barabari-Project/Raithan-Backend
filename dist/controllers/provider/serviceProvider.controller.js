"use strict";
// controllers/serviceProvider.controller.ts
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
exports.verifyLoginOtp = exports.login = exports.profile = exports.updateProfile = exports.verifyOtp = exports.initiateOnboarding = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const serviceProvider_model_1 = __importDefault(require("../../models/serviceProvider.model"));
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_1 = require("../../utils/jwt");
const provider_types_1 = require("../../types/provider.types");
const twilioService_1 = require("../../utils/twilioService");
const __1 = require("../..");
const s3Upload_1 = require("../../utils/s3Upload");
const validation_1 = require("../../utils/validation");
const serviceSeeker_model_1 = __importDefault(require("../../models/serviceSeeker.model"));
const formatImageUrl_1 = require("../../utils/formatImageUrl");
// Onboarding
// Step 1: Store mobile number and send OTP
exports.initiateOnboarding = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber } = req.body;
    if (!(0, validation_1.validateMobileNumber)(mobileNumber)) {
        throw (0, http_errors_1.default)(400, "Invalid mobile number format");
    }
    const existingProvider = yield serviceProvider_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (existingProvider) {
        throw (0, http_errors_1.default)(400, "User is already in onboarding process");
    }
    const seeker = yield serviceSeeker_model_1.default.exists({ mobileNumber: { $eq: mobileNumber } });
    if (seeker) {
        throw (0, http_errors_1.default)(400, "User already exists");
    }
    yield serviceProvider_model_1.default.create({
        mobileNumber,
        status: provider_types_1.ServiceProviderStatus.PENDING
    });
    yield (0, twilioService_1.sendOTP)(mobileNumber);
    res.status(201).json({ message: "OTP sent successfully" });
}));
// Step 2: Verify OTP and send JWT
exports.verifyOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber, code } = req.body;
    if (!(0, validation_1.validateMobileNumber)(mobileNumber)) {
        throw (0, http_errors_1.default)(400, "Invalid mobile number format");
    }
    const existingProvider = yield serviceProvider_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (!existingProvider) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    else if (!existingProvider.status.endsWith(provider_types_1.ServiceProviderStatus.PENDING)) {
        __1.logger.debug(`User ${existingProvider._id} otp is already verified`);
        throw (0, http_errors_1.default)(400, "Your Mobile Number is already verified.");
    }
    yield (0, twilioService_1.verifyOTP)(mobileNumber, code);
    const provider = yield serviceProvider_model_1.default.findOneAndUpdate({ mobileNumber: { $eq: mobileNumber } }, { status: provider_types_1.ServiceProviderStatus.OTP_VERIFIED }, { new: true });
    if (!provider) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    const token = (0, jwt_1.generateJwt)({ userId: provider._id }, process.env.PROVIDER_JWT_SECRET);
    res.status(200).json({
        message: "OTP verified successfully",
        token,
    });
}));
// Step 4: Update profile details
exports.updateProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { firstName, lastName, yearOfBirth, gender } = req.body;
    yearOfBirth = parseInt(yearOfBirth, 10);
    if (!(0, validation_1.validateName)(firstName) || !(0, validation_1.validateName)(lastName) || isNaN(yearOfBirth) || !Object.values(provider_types_1.Gender).includes(gender)) {
        throw (0, http_errors_1.default)(400, "Invalid Inputs");
    }
    const userId = req.userId;
    let provider = yield serviceProvider_model_1.default.findById(userId);
    if (!provider) {
        throw (0, http_errors_1.default)(404, 'User not found');
    }
    else if (provider.status !== provider_types_1.ServiceProviderStatus.OTP_VERIFIED &&
        provider.status !== provider_types_1.ServiceProviderStatus.VERIFICATION_REQUIRED &&
        provider.status !== provider_types_1.ServiceProviderStatus.MODIFICATION_REQUIRED &&
        provider.status !== provider_types_1.ServiceProviderStatus.RE_VERIFICATION_REQUIRED &&
        provider.status !== provider_types_1.ServiceProviderStatus.VERIFIED) {
        throw (0, http_errors_1.default)(400, 'You can not update profile.');
    }
    let profilePicturePath = null;
    // Upload profile picture to S3
    if (req.file) {
        profilePicturePath = yield (0, s3Upload_1.uploadFileToS3)(req.file, 'profile-pictures', provider._id);
    }
    let status;
    if (provider.status == provider_types_1.ServiceProviderStatus.OTP_VERIFIED) {
        status = provider_types_1.ServiceProviderStatus.BUSINESS_DETAILS_REMAINING;
    }
    else if (provider.status == provider_types_1.ServiceProviderStatus.VERIFIED || provider.status == provider_types_1.ServiceProviderStatus.MODIFICATION_REQUIRED) {
        status = provider_types_1.ServiceProviderStatus.RE_VERIFICATION_REQUIRED;
    }
    else {
        status = provider.status;
    }
    if (profilePicturePath) {
        provider = yield serviceProvider_model_1.default.findByIdAndUpdate(userId, { $set: { firstName, lastName, profilePicturePath, gender, yearOfBirth, status } }, { new: true });
    }
    else {
        provider = yield serviceProvider_model_1.default.findByIdAndUpdate(userId, { $set: { firstName, lastName, gender, yearOfBirth, status } }, { new: true });
    }
    yield (0, formatImageUrl_1.formateProviderImage)(provider);
    res.status(200).json({
        message: 'Profile updated successfully',
        provider,
    });
}));
exports.profile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const provider = yield serviceProvider_model_1.default.findById(userId).populate('business');
    res.status(200).json({ provider });
}));
// Login
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber } = req.body;
    const provider = yield serviceProvider_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (!provider) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    yield (0, twilioService_1.sendOTP)(mobileNumber);
    res.status(200).json({ message: "OTP sent successfully" });
}));
// verify otp
exports.verifyLoginOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber, code } = req.body;
    const provider = yield serviceProvider_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (!provider) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    yield (0, twilioService_1.verifyOTP)(mobileNumber, code);
    const token = (0, jwt_1.generateJwt)({ userId: provider._id }, process.env.PROVIDER_JWT_SECRET);
    (0, formatImageUrl_1.formateProviderImage)(provider);
    res.status(200).json({ message: "OTP verified successfully", token, provider });
}));
