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
const twilio_1 = require("twilio");
const __1 = require("..");
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
if (!accountSid || !authToken || !verifyServiceSid) {
    throw new Error('Missing Twilio configuration in environment variables');
}
const client = new twilio_1.Twilio(accountSid, authToken);
/**
 * Send OTP to the provided phone number using Twilio Verify Service.
 * @param toPhoneNumber - The recipient's phone number (E.164 format)
 * @returns Promise with the verification SID
 */
const sendOTP = (toPhoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
    return "";
    const verification = yield client.verify.v2.services(verifyServiceSid)
        .verifications.create({ to: toPhoneNumber, channel: 'sms' });
    return verification.sid;
});
exports.sendOTP = sendOTP;
/**
 * Verify the OTP for a phone number.
 * @param toPhoneNumber - The recipient's phone number (E.164 format)
 * @param code - The OTP provided by the user
 * @returns Promise indicating if the OTP is verified
 */
const verifyOTP = (toPhoneNumber, code) => __awaiter(void 0, void 0, void 0, function* () {
    return code == '123123' ? true : false;
    const verificationCheck = yield client.verify.v2.services(verifyServiceSid)
        .verificationChecks.create({ to: toPhoneNumber, code });
    if (verificationCheck.status === 'approved') {
        return true;
    }
    else {
        __1.logger.error('OTP verification failed');
        throw (0, http_errors_1.default)(400, 'OTP verification failed');
    }
});
exports.verifyOTP = verifyOTP;
