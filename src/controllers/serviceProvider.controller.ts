// controllers/serviceProvider.controller.ts

import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import ServiceProvider from '../models/serviceProvider.model';
import createHttpError from 'http-errors';
import { generateJwt } from "../utils/jwt";
import { ServiceProviderStatus } from '../types/provider.types';
import { sendOTP, verifyOTP } from '../utils/twilioService';
import { logger } from '..';
import { uploadFileToS3 } from '../utils/s3Upload';
import { validateMobileNumber, validateName } from '../utils/validation';

// Step 1: Store mobile number and send OTP
export const initiateOnboarding = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;

    if (!validateMobileNumber(mobileNumber)) {
        throw createHttpError(400, "Invalid mobile number format");
    }

    const existingProvider = await ServiceProvider.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (existingProvider) {
        if (!existingProvider.status.endsWith(ServiceProviderStatus.PENDING)) {
            logger.debug(`User ${existingProvider._id} otp is already verified`);
            throw createHttpError(400, "User is already in onboarding process");
        }
    }

    await ServiceProvider.findOneAndUpdate(
        { mobileNumber: { $eq: mobileNumber } },
        { $set: { mobileNumber, status: ServiceProviderStatus.PENDING } },
        { upsert: true, new: true }
    );

    await sendOTP(mobileNumber);

    res.status(200).json({ success: true, message: "OTP sent successfully" });

});

// Step 2: Verify OTP and send JWT
export const verifyOtp = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber, code } = req.body;

    if (!validateMobileNumber(mobileNumber)) {
        throw createHttpError(400, "Invalid mobile number format");
    }

    const existingProvider = await ServiceProvider.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (!existingProvider) {
        throw createHttpError(404, "User not found");
    } else if (!existingProvider.status.endsWith(ServiceProviderStatus.PENDING)) {
        logger.debug(`User ${existingProvider._id} otp is already verified`);
        throw createHttpError(400, "User is already in onboarding process");
    }

    await verifyOTP(mobileNumber, code);

    const provider = await ServiceProvider.findOneAndUpdate(
        { mobileNumber: { $eq: mobileNumber } },
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
});

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

export const updateProfile = expressAsyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName } = req.body;

    if (!validateName(firstName) || !validateName(lastName)) {
        throw createHttpError(400, "Invalid name format");
    }

    const userId = req.userId;
    // Ensure file exists in the request
    if (!req.file) {
        throw createHttpError(400, 'Profile picture is required');
    }

    let provider = await ServiceProvider.findById(userId);

    if (!provider) {
        throw createHttpError(404, 'User not found');
    } else if (!provider.status.endsWith(ServiceProviderStatus.OTP_VERIFIED)) {
        throw createHttpError(400, 'Please verify your OTP first');
    }

    // Upload profile picture to S3
    const profilePictureUrl = await uploadFileToS3(req.file, 'profile-pictures');

    provider = await ServiceProvider.findByIdAndUpdate(
        userId,
        { $set: { firstName, lastName, profilePictureUrl, status: ServiceProviderStatus.COMPLETED } },
        { new: true }
    );

    if (!provider) {
        throw createHttpError(404, 'User not found');
    }

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        provider,
    });
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
