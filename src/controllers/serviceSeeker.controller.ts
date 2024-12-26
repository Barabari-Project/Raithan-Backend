
import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import ServiceSeeker from '../models/serviceSeeker.model';
import createHttpError from 'http-errors';
import { sendOTP, verifyOTP } from '../utils/twilioService';
import ServiceProvider from '../models/serviceProvider.model';
import { generateJwt } from '../utils/jwt';

// Login
export const login = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;

    const seeker = await ServiceSeeker.findOne({ mobileNumber: { $eq: mobileNumber } });

    if (!seeker) {
        throw createHttpError(404, "User not found");
    }

    const provider = await ServiceProvider.exists({ mobileNumber: { $eq: mobileNumber } });

    if (provider) {
        throw createHttpError(400, "Please login as service provider");
    } else {
        const newSeeker = new ServiceSeeker({ mobileNumber });
        await newSeeker.save();
    }

    await sendOTP(mobileNumber);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
});

// verify otp
export const verifyLoginOtp = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber, code } = req.body;

    const seeker = await ServiceSeeker.findOne({ mobileNumber: { $eq: mobileNumber } });

    if (!seeker) {
        throw createHttpError(404, "User not found");
    }

    await verifyOTP(mobileNumber, code);

    const token = generateJwt({ userId: seeker._id }, process.env.SEEKER_JWT_SECRET!);

    res.status(200).json({ success: true, message: "OTP verified successfully", token, seeker });
});