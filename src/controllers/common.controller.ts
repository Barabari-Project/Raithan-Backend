import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import createHttpError from "http-errors";
import ServiceProvider from "../models/serviceProvider.model";
import ServiceSeeker from "../models/serviceSeeker.model";
import { Business } from "../models/business.model";

export const getServiceProviderById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Validate the id parameter
    if (!isValidObjectId(id)) {
        throw createHttpError(400, "Invalid service provider ID");
    }

    const serviceProvider = await ServiceProvider.findById(id).populate('business');

    if (!serviceProvider) {
        throw createHttpError(404, "Service provider not found");
    }

    res.status(200).json(serviceProvider);
});

// Get a business by ID
export const getBusinessById = expressAsyncHandler(async (req: Request, res: Response) => {
    const business = await Business.findById(req.params.id);
    if (!isValidObjectId(req.params.id)) {
        throw createHttpError(400, 'Invalid business ID');
    }
    if (!business) {
        throw createHttpError(404, 'Business not found');
    }
    res.status(200).json({ success: true, business });
});

export const getBusinessesByUserId = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw createHttpError(400, 'Invalid User ID');
    }

    // Find businesses by userId
    const business = await Business.findOne({ serviceProvider: userId }).populate('serviceProvider');
    if (!business) {
        throw createHttpError(404, 'No businesses found for the given userId');
    }

    res.status(200).json({
        success: true,
        business,
    });
});

export const getServiceSeekerById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw createHttpError(400, "Invalid service seeker ID");
    }
    const serviceSeeker = await ServiceSeeker.findById(id);
    if (!serviceSeeker) {
        throw createHttpError(404, "Service seeker not found");
    }
    res.status(200).json(serviceSeeker);
});