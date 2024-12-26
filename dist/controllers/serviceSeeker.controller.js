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
exports.verifyLoginOtp = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const serviceSeeker_model_1 = __importDefault(require("../models/serviceSeeker.model"));
const http_errors_1 = __importDefault(require("http-errors"));
const twilioService_1 = require("../utils/twilioService");
const serviceProvider_model_1 = __importDefault(require("../models/serviceProvider.model"));
const jwt_1 = require("../utils/jwt");
// Login
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber } = req.body;
    const seeker = yield serviceSeeker_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (!seeker) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    const provider = yield serviceProvider_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (provider) {
        throw (0, http_errors_1.default)(400, "User already exists");
    }
    yield (0, twilioService_1.sendOTP)(mobileNumber);
    res.status(200).json({ success: true, message: "OTP sent successfully" });
}));
// verify otp
exports.verifyLoginOtp = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNumber, code } = req.body;
    const seeker = yield serviceSeeker_model_1.default.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (!seeker) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    yield (0, twilioService_1.verifyOTP)(mobileNumber, code);
    const token = (0, jwt_1.generateJwt)({ userId: seeker._id }, process.env.SEEKER_JWT_SECRET);
    res.status(200).json({ success: true, message: "OTP verified successfully", token, seeker });
}));
