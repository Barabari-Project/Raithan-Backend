import AWS from "aws-sdk";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID1,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY1,
});
const sns = new AWS.SNS();

export const sendOTP = async (phone: String) => {
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
}

export const verifyOTP = async (phone: string, otp: string) => {
    return;
    // const otpEntry = await OTPModel.findOne({ phone });
    // if (!otpEntry || otpEntry.otp !== otp || new Date() > otpEntry.expiresAt) {
    //     throw createHttpError(400, "Invalid OTP");
    // }
};