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
exports.getProductsByDistanceAndHp = exports.createCallEvent = exports.verifyLoginOtp = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongoose_1 = require("mongoose");
const callHistory_model_1 = __importDefault(require("../models/callHistory.model"));
const serviceProvider_model_1 = __importDefault(require("../models/serviceProvider.model"));
const serviceSeeker_model_1 = __importDefault(require("../models/serviceSeeker.model"));
const business_types_1 = require("../types/business.types");
const product_types_1 = require("../types/product.types");
const provider_types_1 = require("../types/provider.types");
const seeker_types_1 = require("../types/seeker.types");
const formatImageUrl_1 = require("../utils/formatImageUrl");
const jwt_1 = require("../utils/jwt");
const twilioService_1 = require("../utils/twilioService");
// Login
exports.login = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber } = req.body;
    const seeker = yield serviceSeeker_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    const provider = yield serviceProvider_model_1.default.exists({ mobileNumber: { $eq: mobileNumber } });
    if (provider) {
        throw (0, http_errors_1.default)(400, "Please login as service provider");
    }
    else if (!seeker) {
        const newSeeker = new serviceSeeker_model_1.default({ mobileNumber, status: seeker_types_1.ServiceSeekerStatus.PENDING });
        yield newSeeker.save();
    }
    yield (0, twilioService_1.sendOTP)(mobileNumber);
    res.status(200).json({ message: "OTP sent successfully" });
}));
// verify otp
exports.verifyLoginOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber, code } = req.body;
    const seeker = yield serviceSeeker_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (!seeker) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    if (code == '') {
        throw (0, http_errors_1.default)(400, "Invalid OTP");
    }
    yield (0, twilioService_1.verifyOTP)(mobileNumber, code);
    if (seeker.status == seeker_types_1.ServiceSeekerStatus.PENDING) {
        seeker.status = seeker_types_1.ServiceSeekerStatus.VERIFIED;
        yield seeker.save();
    }
    const token = (0, jwt_1.generateJwt)({ userId: seeker._id }, process.env.SEEKER_JWT_SECRET);
    res.status(200).json({ success: true, message: "OTP verified successfully", token, seeker });
}));
exports.createCallEvent = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceProviderId } = req.body;
    const serviceSeekerId = req.userId;
    if (!(0, mongoose_1.isValidObjectId)(serviceProviderId)) {
        throw (0, http_errors_1.default)(400, "Invalid service provider ID");
    }
    const serviceProvider = yield serviceProvider_model_1.default.findById(serviceProviderId);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    if (serviceProvider.status !== provider_types_1.ServiceProviderStatus.VERIFIED) {
        throw (0, http_errors_1.default)(403, "Service provider is not verified");
    }
    const serviceSeeker = yield serviceSeeker_model_1.default.findById(serviceSeekerId);
    yield callHistory_model_1.default.create({
        serviceSeekerMobileNumber: serviceSeeker === null || serviceSeeker === void 0 ? void 0 : serviceSeeker.mobileNumber,
        serviceProviderMobileNumber: serviceProvider.mobileNumber,
        serviceProvider: serviceProviderId,
        serviceSeeker: serviceSeekerId,
    });
    res.sendStatus(200);
}));
exports.getProductsByDistanceAndHp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, lng, distance, category, hp } = req.body;
    if (!Object.values(business_types_1.BusinessCategory).includes(category)) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    if (hp) {
        if (isNaN(hp)) {
            throw (0, http_errors_1.default)(400, "Invalid hp");
        }
    }
    const model = product_types_1.modelMapping[category];
    if (!model) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    const query = {};
    if (hp) {
        query.hp = { $gte: hp };
    }
    query.verificationStatus = product_types_1.ProductStatus.VERIFIED;
    const products = yield model
        .find(query)
        .populate("business");
    let filteredProductList = products.filter((product) => {
        if (product.business.location) {
            const { lat: productLat, lng: productLng } = product.business.location;
            const distanceInMeters = calculateDistance(lat, lng, productLat, productLng);
            return distanceInMeters <= distance;
        }
    });
    const formatedImgUrlPromises = filteredProductList.map((filteredProduct) => __awaiter(void 0, void 0, void 0, function* () { return (0, formatImageUrl_1.formatProductImageUrls)(filteredProduct); }));
    yield Promise.all(formatedImgUrlPromises);
    res.status(200).json({ productList: filteredProductList });
}));
function calculateDistance(lat1, lng1, lat2, lng2) {
    const toRadians = (degree) => degree * (Math.PI / 180);
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}
