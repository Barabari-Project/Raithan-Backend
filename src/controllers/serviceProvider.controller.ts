// controllers/serviceProvider.controller.ts

import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import ServiceProvider from '../models/serviceProvider.model';
import createHttpError from 'http-errors';
import { generateJwt } from "../utils/jwt";
import { ServiceProviderStatus } from '../types/provider.types';

// Step 1: Store mobile number and send OTP
export const initiateOnboarding = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;

    try {
        const provider = await ServiceProvider.findOneAndUpdate(
            { mobileNumber },
            { mobileNumber, status: ServiceProviderStatus.PENDING },
            { upsert: true, new: true }
        );

        // Trigger Twilio OTP (integration assumed)
        // await sendOtpToUser(mobileNumber);

        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error: any) {
        throw createHttpError(500, error.message);
    }
});

// Step 2: Verify OTP and send JWT
export const verifyOtp = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;

    try {
        // Assume OTP verification logic happens here

        const provider = await ServiceProvider.findOneAndUpdate(
            { mobileNumber },
            { status: ServiceProviderStatus.OTP_VERIFIED },
            { new: true }
        );

        if (!provider) {
            throw createHttpError(404, "User not found");
        }

        const token = generateJwt({ userId: provider._id });

        res.status(200).json({
            success: true,
            message: "OTP verified successfully",
            token,
        });
    } catch (error: any) {
        throw createHttpError(500, error);
    }
});

// Step 3: Store email and password and send verification link
export const addEmailAndPassword = expressAsyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userId = req.userId;

    try {
        const provider = await ServiceProvider.findByIdAndUpdate(
            userId,
            { email, password, status: ServiceProviderStatus.EMAIL_VERIFIED },
            { new: true }
        );

        if (!provider) {
            throw createHttpError(404, "User not found");
        }

        // Trigger email verification (integration assumed)
        // await sendEmailVerificationLink(email);

        res.status(200).json({
            success: true,
            message: "Email verification link sent",
        });
    } catch (error: any) {
        throw createHttpError(500, error);
    }
});

// Step 4: Update profile details
export const updateProfile = expressAsyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, profilePictureUrl } = req.body;
    const userId = req.userId;

    try {
        const provider = await ServiceProvider.findByIdAndUpdate(
            userId,
            { firstName, lastName, profilePictureUrl, status: ServiceProviderStatus.COMPLETED },
            { new: true }
        );

        if (!provider) {
            throw createHttpError(404, "User not found");
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
        });
    } catch (error: any) {
        throw createHttpError(500, error.message);
    }
});


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
