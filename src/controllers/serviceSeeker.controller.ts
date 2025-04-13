
import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import CallHistory from '../models/callHistory.model';
import ServiceProvider from '../models/serviceProvider.model';
import ServiceSeeker from '../models/serviceSeeker.model';
import { BusinessCategory, IBusiness } from '../types/business.types';
import { ProductStatus, ProductType } from '../types/product.types';
import { ServiceSeekerStatus } from '../types/seeker.types';
import { formatProductImageUrls } from '../utils/formatImageUrl';
import { generateJwt } from '../utils/jwt';
import { modelMapping } from '../utils/modelMapping';
import { sendOTP, verifyOTP } from '../utils/twilioService';

// Login
export const login = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { mobileNumber } = req.body;

    let seeker = await ServiceSeeker.findOne({ mobileNumber: { $eq: mobileNumber } });

    const provider = await ServiceProvider.exists({ mobileNumber: { $eq: mobileNumber } });

    if (provider) {
        throw createHttpError(400, "Please login as service provider");
    } else if (!seeker) {
        // const newSeeker = new ServiceSeeker({ mobileNumber, status: ServiceSeekerStatus.PENDING });
        seeker = new ServiceSeeker({ mobileNumber, status: ServiceSeekerStatus.VERIFIED });
        await seeker.save();
    }

    const token = generateJwt({ userId: seeker!._id }, process.env.SEEKER_JWT_SECRET!);

    res.status(200).json({ success: true, message: "LogIn successfully", token, seeker });

    // await sendOTP(mobileNumber);

    // res.status(200).json({ message: "OTP sent successfully" });
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

    // if (serviceProvider.status !== ServiceProviderStatus.VERIFIED) {
    //     throw createHttpError(403, "Service provider is not verified");
    // }

    const serviceSeeker = await ServiceSeeker.findById(serviceSeekerId);

    await CallHistory.create({
        serviceSeekerMobileNumber: serviceSeeker?.mobileNumber,
        serviceProviderMobileNumber: serviceProvider.mobileNumber,
        serviceProvider: serviceProviderId,
        serviceSeeker: serviceSeekerId,
    });
    res.sendStatus(204);
});

type ProductWithLocation = ProductType & {
    location: {
        lat: number;
        lng: number;
    } | null;
    business: IBusiness
};

export const getProductsByDistanceAndHp = expressAsyncHandler(async (req: Request, res: Response) => {
    let { lat, lng, distance, category, hpLow, hpHigh, type, service } = req.body;
    if (!Object.values(BusinessCategory).includes(category as BusinessCategory)) {
        throw createHttpError(400, "Invalid category");
    }

    if (lat) {
        if (isNaN(parseFloat(lat))) {
            throw createHttpError(400, "Invalid latitude");
        }
    }
    if (lng) {
        if (isNaN(parseFloat(lng))) {
            throw createHttpError(400, "Invalid longitude");
        }
    }

    if (lat) {
        lat = parseFloat(lat);
    }
    if (lng) {
        lng = parseFloat(lng);
    }

    if (hpLow) {
        if (isNaN(hpLow)) {
            throw createHttpError(400, "Invalid hp");
        }
    }
    if (hpHigh) {
        if (isNaN(hpHigh)) {
            throw createHttpError(400, "Invalid hp");
        }
    }

    const model = modelMapping[category as BusinessCategory];
    if (!model) {
        throw createHttpError(400, "Invalid category");
    }

    const query: any = {};
    if (hpHigh && hpLow) {
        query.hp = {};
        query.hp.$lte = parseInt(hpHigh);
        query.hp.$gte = parseInt(hpLow);
    }
    query.verificationStatus = ProductStatus.VERIFIED;

    if (category == BusinessCategory.DRONES || category == BusinessCategory.IMPLEMENTS || category == BusinessCategory.HARVESTORS || category == BusinessCategory.EARTH_MOVERS) {
        if (type) {
            query.type = { $regex: type, $options: 'i' };
        }
    } else if (service) {
        query.services = { $in: [service] };
    }

    const products = await model
        .find(query)
        .select("-images.driving-license -images.rc-book -images.bill -images.e-shram-card  ")
        .populate("business");
    let filteredProductList: ProductWithLocation[] = products.filter((product: ProductWithLocation) => {
        if (product.business.location && lat && lng) {
            const { lat: productLat, lng: productLng } = product.business.location;
            const distanceInMeters = calculateDistance(lat, lng, productLat, productLng);
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