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
exports.updateProfile = exports.verifyOtp = exports.initiateOnboarding = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const serviceProvider_model_1 = __importDefault(require("../models/serviceProvider.model"));
const http_errors_1 = __importDefault(require("http-errors"));
const jwt_1 = require("../utils/jwt");
const provider_types_1 = require("../types/provider.types");
const twilioService_1 = require("../utils/twilioService");
const __1 = require("..");
const s3Upload_1 = require("../utils/s3Upload");
const validation_1 = require("../utils/validation");
// Step 1: Store mobile number and send OTP
exports.initiateOnboarding = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber } = req.body;
    if (!(0, validation_1.validateMobileNumber)(mobileNumber)) {
        throw (0, http_errors_1.default)(400, "Invalid mobile number format");
    }
    const existingProvider = yield serviceProvider_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (existingProvider) {
        if (!existingProvider.status.endsWith(provider_types_1.ServiceProviderStatus.PENDING)) {
            __1.logger.debug(`User ${existingProvider._id} otp is already verified`);
            throw (0, http_errors_1.default)(400, "User is already in onboarding process");
        }
    }
    yield serviceProvider_model_1.default.findOneAndUpdate({ mobileNumber: { $eq: mobileNumber } }, { $set: { mobileNumber, status: provider_types_1.ServiceProviderStatus.PENDING } }, { upsert: true, new: true });
    yield (0, twilioService_1.sendOTP)(mobileNumber);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
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
        throw (0, http_errors_1.default)(400, "User is already in onboarding process");
    }
    yield (0, twilioService_1.verifyOTP)(mobileNumber, code);
    const provider = yield serviceProvider_model_1.default.findOneAndUpdate({ mobileNumber: { $eq: mobileNumber } }, { status: provider_types_1.ServiceProviderStatus.OTP_VERIFIED }, { new: true });
    if (!provider) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    const token = (0, jwt_1.generateJwt)({ userId: provider._id }, process.env.PROVIDER_JWT_SECRET);
    res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        token,
    });
}));
// Step 3: Store email and password and send verification link
// export const addEmailAndPassword = expressAsyncHandler(async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     const userId = req.userId;
//     try {
//         const provider = await ServiceProvider.findByIdAndUpdate(
//             userId,
//             { email, password, status: ServiceProviderStatus.EMAIL_VERIFIED },
//             { new: true }
//         );
//         if (!provider) {
//             throw createHttpError(404, "User not found");
//         }
//         // Trigger email verification (integration assumed)
//         // await sendEmailVerificationLink(email);
//         res.status(200).json({
//             success: true,
//             message: "Email verification link sent",
//         });
//     } catch (error: any) {
//         throw createHttpError(500, error);
//     }
// });
// Step 4: Update profile details
exports.updateProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName } = req.body;
    if (!(0, validation_1.validateName)(firstName) || !(0, validation_1.validateName)(lastName)) {
        throw (0, http_errors_1.default)(400, "Invalid name format");
    }
    const userId = req.userId;
    // Ensure file exists in the request
    if (!req.file) {
        throw (0, http_errors_1.default)(400, 'Profile picture is required');
    }
    let provider = yield serviceProvider_model_1.default.findById(userId);
    if (!provider) {
        throw (0, http_errors_1.default)(404, 'User not found');
    }
    else if (!provider.status.endsWith(provider_types_1.ServiceProviderStatus.OTP_VERIFIED)) {
        throw (0, http_errors_1.default)(400, 'Please verify your OTP first');
    }
    // Upload profile picture to S3
    const profilePictureUrl = yield (0, s3Upload_1.uploadFileToS3)(req.file, 'profile-pictures');
    provider = yield serviceProvider_model_1.default.findByIdAndUpdate(userId, { $set: { firstName, lastName, profilePictureUrl, status: provider_types_1.ServiceProviderStatus.COMPLETED } }, { new: true });
    if (!provider) {
        throw (0, http_errors_1.default)(404, 'User not found');
    }
    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        provider,
    });
}));
// Get all service providers
// const getAllServiceProviders = expressAsyncHandler(async (req: Request, res: Response) => {
//     const serviceProviders = await ServiceProvider.find();
//     res.status(200).json(serviceProviders);
// });
// // Get a specific service provider by ID
// const getServiceProviderById = expressAsyncHandler(async (req: Request, res: Response) => {
//     const serviceProvider = await ServiceProvider.findById(req.params.id);
//     if (!serviceProvider) {
//         throw createHttpError(404, 'Service Provider not found');
//     }
//     res.status(200).json(serviceProvider);
// });
// // Update a service provider by ID
// const updateServiceProvider = expressAsyncHandler(async (req: Request, res: Response) => {
//     const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true } // Returns the updated document
//     );
//     if (!updatedServiceProvider) {
//         throw createHttpError(404, 'Service Provider not found');
//     }
//     res.status(200).json(updatedServiceProvider);
// });
// // Not Using this for now.
// const deleteServiceProvider = expressAsyncHandler(async (req: Request, res: Response) => {
//     const deletedServiceProvider = await ServiceProvider.findByIdAndDelete(req.params.id);
//     if (!deletedServiceProvider) {
//         throw createHttpError(404, 'Service Provider not found');
//     }
//     res.status(200).json({ message: 'Service Provider deleted successfully' });
// });
// export {
//     createServiceProvider,
//     getAllServiceProviders,
//     getServiceProviderById,
//     updateServiceProvider,
//     deleteServiceProvider
// };
