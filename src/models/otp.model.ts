import mongoose, { Schema } from "mongoose";
import { IOTP } from "../types/business.types";

// Define the Schema
const OTPSchema = new Schema<IOTP>(
    {
        phone: {
            type: String,
            required: true,
            unique: true, // Ensures one OTP per phone at a time
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
        }
    },
    { timestamps: true }
);

// Create the Model
const OTPModel = mongoose.model<IOTP>("OTP", OTPSchema, 'OTP');

export default OTPModel;
