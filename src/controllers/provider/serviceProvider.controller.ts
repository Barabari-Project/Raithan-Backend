// controllers/serviceProvider.controller.ts

import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { logger } from '../..';
import ServiceProvider from '../../models/serviceProvider.model';
import ServiceSeeker from '../../models/serviceSeeker.model';
import { BusinessCategory } from '../../types/business.types';
import { ProductStatus, ProductType } from '../../types/product.types';
import { Gender, ServiceProviderStatus } from '../../types/provider.types';
import { formateProviderImage, formatProductImageUrls } from '../../utils/formatImageUrl';
import { generateJwt } from "../../utils/jwt";
import { uploadFileToS3 } from '../../utils/s3Upload';

import { validateMobileNumber, validateName } from '../../utils/validation';
import { modelMapping } from '../../utils/modelMapping';
import { sendOTP, verifyOTP } from '../../utils/s3OTPService';

// Onboarding
// Step 1: Store mobile number and send OTP
export const initiateOnboarding = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;

    if (!validateMobileNumber(mobileNumber)) {
        throw createHttpError(400, "Invalid mobile number format");
    }

    const existingProvider = await ServiceProvider.findOne({ mobileNumber: { $eq: mobileNumber } });
    if (existingProvider && existingProvider.status != ServiceProviderStatus.PENDING) {
        throw createHttpError(400, "User is already in onboarding process");
    }

    const seeker = await ServiceSeeker.exists({ mobileNumber: { $eq: mobileNumber } });

    if (seeker) {
        throw createHttpError(400, "User already exists");
    }

    if (existingProvider == null) {
        await ServiceProvider.create({
            mobileNumber,
            status: ServiceProviderStatus.PENDING
        });
    }

    await sendOTP(mobileNumber);

    res.status(201).json({ message: "OTP sent successfully" });

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
        throw createHttpError(400, "Your Mobile Number is already verified.");
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

    const token = generateJwt({ userId: provider._id }, process.env.PROVIDER_JWT_SECRET!);

    res.status(200).json({
        message: "OTP verified successfully",
        token,
    });
});

// Step 4: Update profile details
export const updateProfile = expressAsyncHandler(async (req: Request, res: Response) => {
    let { firstName, lastName, yearOfBirth, gender } = req.body;
    yearOfBirth = parseInt(yearOfBirth, 10);
    if (!validateName(firstName) || !validateName(lastName) || isNaN(yearOfBirth) || !Object.values(Gender).includes(gender)) {
        throw createHttpError(400, "Invalid Inputs");
    }

    const userId = req.userId;

    let provider = await ServiceProvider.findById(userId);

    if (!provider) {
        throw createHttpError(404, 'User not found');
    } else if (provider.status !== ServiceProviderStatus.OTP_VERIFIED &&
        provider.status !== ServiceProviderStatus.VERIFICATION_REQUIRED &&
        provider.status !== ServiceProviderStatus.MODIFICATION_REQUIRED &&
        provider.status !== ServiceProviderStatus.RE_VERIFICATION_REQUIRED &&
        provider.status !== ServiceProviderStatus.VERIFIED) {
        throw createHttpError(400, 'You can not update profile.');
    }
    let profilePicturePath = null;
    // Upload profile picture to S3
    if (req.file) {
        profilePicturePath = await uploadFileToS3(req.file, 'profile-pictures', provider._id);
    }
    let status;
    if (provider.status == ServiceProviderStatus.OTP_VERIFIED) {
        status = ServiceProviderStatus.BUSINESS_DETAILS_REMAINING;
    } else if (provider.status == ServiceProviderStatus.VERIFIED || provider.status == ServiceProviderStatus.MODIFICATION_REQUIRED) {
        status = ServiceProviderStatus.RE_VERIFICATION_REQUIRED;
    } else {
        status = provider.status;
    }

    if (profilePicturePath) {
        provider = await ServiceProvider.findByIdAndUpdate(
            userId,
            { $set: { firstName, lastName, profilePicturePath, gender, yearOfBirth, status } },
            { new: true }
        );
    } else {
        provider = await ServiceProvider.findByIdAndUpdate(
            userId,
            { $set: { firstName, lastName, gender, yearOfBirth, status } },
            { new: true }
        );
    }

    await formateProviderImage(provider!);

    res.status(200).json({
        message: 'Profile updated successfully',
        provider,
    });
});

export const profile = expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId;
    const provider = await ServiceProvider.findById(userId).populate('business');
    await formateProviderImage(provider!);
    res.status(200).json({ provider });
});

export const getProductsByCategoryAndProivderId = expressAsyncHandler(async (req: Request, res: Response) => {
    const { category, status } = req.query;
    const userId = req.userId;

    const serviceProvider = await ServiceProvider.findById(userId);

    if (serviceProvider!.status == ServiceProviderStatus.BUSINESS_DETAILS_REMAINING ||
        serviceProvider!.status == ServiceProviderStatus.OTP_VERIFIED ||
        serviceProvider!.status == ServiceProviderStatus.PENDING) {
        throw createHttpError(403, "Invalid Access");
    }

    if (Object.values(BusinessCategory).includes(category as BusinessCategory)) {
        const model = modelMapping[category as BusinessCategory];
        const query: Query = {};
        interface Query {
            verificationStatus?: ProductStatus;
            business?: mongoose.Types.ObjectId;
        }
        if (serviceProvider?.business) {
            query.business = serviceProvider.business;
        }
        if (status) query.verificationStatus = status as ProductStatus;
        const products = await model.find(query);

        const formatedImgUrlPromises = products.map(async (product: ProductType) => formatProductImageUrls(product));

        await Promise.all(formatedImgUrlPromises);

        res.status(200).json({ products });
    } else {
        throw createHttpError(400, "Invalid category");
    }
});

// Login
export const login = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber } = req.body;

    const provider = await ServiceProvider.findOne({ mobileNumber: { $eq: mobileNumber } });

    if (!provider) {
        throw createHttpError(404, "User not found");
    }

    if (provider.status == ServiceProviderStatus.BLOCKED) {
        throw createHttpError(400, "Your account is blocked");
    }

    await sendOTP(mobileNumber);

    res.status(200).json({ message: "OTP sent successfully" });
});

// verify otp
export const verifyLoginOtp = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber, code } = req.body;

    const provider = await ServiceProvider.findOne({ mobileNumber: { $eq: mobileNumber } });

    if (!provider) {
        throw createHttpError(404, "User not found");
    }

    if (provider.status == ServiceProviderStatus.BLOCKED) {
        throw createHttpError(400, "Your account is blocked");
    }

    await verifyOTP(mobileNumber, code);

    if (provider.status == ServiceProviderStatus.PENDING) {
        provider.status = ServiceProviderStatus.OTP_VERIFIED;
        await ServiceProvider.findByIdAndUpdate(provider._id, { $set: { status: ServiceProviderStatus.VERIFIED } })
    }

    const token = generateJwt({ userId: provider._id }, process.env.PROVIDER_JWT_SECRET!);

    formateProviderImage(provider);

    res.status(200).json({ message: "OTP verified successfully", token, provider });
});
