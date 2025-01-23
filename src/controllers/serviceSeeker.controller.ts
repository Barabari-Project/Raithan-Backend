
import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import CallHistory from '../models/callHistory.model';
import ServiceProvider from '../models/serviceProvider.model';
import ServiceSeeker from '../models/serviceSeeker.model';
import { BusinessCategory, IBusiness } from '../types/business.types';
import { ProductStatus, ProductType } from '../types/product.types';
import { modelMapping } from '../utils/modelMapping';
import { ServiceProviderStatus } from '../types/provider.types';
import { ServiceSeekerStatus } from '../types/seeker.types';
import { formatProductImageUrls } from '../utils/formatImageUrl';
import { generateJwt } from '../utils/jwt';
import { sendOTP, verifyOTP } from '../utils/twilioService';
import { logger } from '..';
import { log } from 'console';

// Login
export const login = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { mobileNumber } = req.body;

    const seeker = await ServiceSeeker.findOne({ mobileNumber: { $eq: mobileNumber } });

    const provider = await ServiceProvider.exists({ mobileNumber: { $eq: mobileNumber } });

    if (provider) {
        throw createHttpError(400, "Please login as service provider");
    } else if (!seeker) {
        const newSeeker = new ServiceSeeker({ mobileNumber, status: ServiceSeekerStatus.PENDING });
        await newSeeker.save();
    }

    await sendOTP(mobileNumber);

    res.status(200).json({ message: "OTP sent successfully" });
});

// verify otp
export const verifyLoginOtp = expressAsyncHandler(async (req: Request, res: Response) => {
    const { mobileNumber, code } = req.body;

    const seeker = await ServiceSeeker.findOne({ mobileNumber: { $eq: mobileNumber } });

    if (!seeker) {
        throw createHttpError(404, "User not found");
    }

    if (code == '') {
        throw createHttpError(400, "Invalid OTP");
    }

    await verifyOTP(mobileNumber, code);

    if (seeker.status == ServiceSeekerStatus.PENDING) {
        seeker.status = ServiceSeekerStatus.VERIFIED;
        await seeker.save();
    }

    const token = generateJwt({ userId: seeker._id }, process.env.SEEKER_JWT_SECRET!);

    res.status(200).json({ success: true, message: "OTP verified successfully", token, seeker });
});

export const createCallEvent = expressAsyncHandler(async (req: Request, res: Response) => {
    const { serviceProviderId } = req.body;
    const serviceSeekerId = req.userId;
    if (!isValidObjectId(serviceProviderId)) {
        throw createHttpError(400, "Invalid service provider ID");
    }
    const serviceProvider = await ServiceProvider.findById(serviceProviderId);

    if (!serviceProvider) {
        throw createHttpError(404, "Service provider not found");
    }

    if (serviceProvider.status !== ServiceProviderStatus.VERIFIED) {
        throw createHttpError(403, "Service provider is not verified");
    }

    const serviceSeeker = await ServiceSeeker.findById(serviceSeekerId);

    await CallHistory.create({
        serviceSeekerMobileNumber: serviceSeeker?.mobileNumber,
        serviceProviderMobileNumber: serviceProvider.mobileNumber,
        serviceProvider: serviceProviderId,
        serviceSeeker: serviceSeekerId,
    });
    res.sendStatus(200);
});

type ProductWithLocation = ProductType & {
    location: {
        lat: number;
        lng: number;
    } | null;
    business: IBusiness
};

export const getProductsByDistanceAndHp = expressAsyncHandler(async (req: Request, res: Response) => {
    let { lat, lng, distance, category, hp } = req.body;

    if (!Object.values(BusinessCategory).includes(category as BusinessCategory)) {
        throw createHttpError(400, "Invalid category");
    }

    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
        throw createHttpError(400, "Invalid latitude or longitude");
    }

    lat = parseFloat(lat);
    lng = parseFloat(lng);

    if (hp) {
        if (isNaN(hp)) {
            throw createHttpError(400, "Invalid hp");
        }
    }

    const model = modelMapping[category as BusinessCategory];
    if (!model) {
        throw createHttpError(400, "Invalid category");
    }

    const query: any = {};
    if (hp) {
        query.hp = { $lte: hp };
    }

    query.verificationStatus = ProductStatus.VERIFIED;

    const products = await model
        .find(query)
        .populate("business");

    let filteredProductList: ProductWithLocation[] = products.filter((product: ProductWithLocation) => {
        if (product.business.location) {
            const { lat: productLat, lng: productLng } = product.business.location;
            logger.debug(lat);
            logger.debug(lng);
            logger.debug(productLat);
            logger.debug(productLng);
            const distanceInMeters = calculateDistance(lat, lng, productLat, productLng);
            logger.debug(distanceInMeters);
            logger.debug(distance);
            return distanceInMeters <= distance;
        }
    });

    const formatedImgUrlPromises = filteredProductList.map(async (filteredProduct: ProductWithLocation) => formatProductImageUrls(filteredProduct));

    await Promise.all(formatedImgUrlPromises);

    res.status(200).json({ productList: filteredProductList });
});

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRadians = (degree: number): number => degree * (Math.PI / 180);

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}