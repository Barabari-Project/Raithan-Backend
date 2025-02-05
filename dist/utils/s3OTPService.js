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
exports.verifyOTP = exports.sendOTP = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
aws_sdk_1.default.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1,
});
const sns = new aws_sdk_1.default.SNS();
const sendOTP = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    return;
    // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    // const params = {
    //     Message: `Your OTP code is ${otp}`,
    //     PhoneNumber: `+91${phone}`, // Ensure +91 for India
    // };
    // const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    // const otpEntry = await OTPModel.findOneAndUpdate(
    //     { phone },
    //     { otp, expiresAt },
    //     { upsert: true, new: true }
    // );
    // await sns.publish(params).promise();
});
exports.sendOTP = sendOTP;
const verifyOTP = (phone, otp) => __awaiter(void 0, void 0, void 0, function* () {
    return;
    // const otpEntry = await OTPModel.findOne({ phone });
    // if (!otpEntry || otpEntry.otp !== otp || new Date() > otpEntry.expiresAt) {
    //     throw createHttpError(400, "Invalid OTP");
    // }
});
exports.verifyOTP = verifyOTP;
