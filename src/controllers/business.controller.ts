import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { Business } from '../models/business.model';
import { isValidObjectId } from 'mongoose';
import ServiceProvider from '../models/serviceProvider.model';
import expressAsyncHandler from 'express-async-handler';
import { logger } from '..';

// Create a new business
export const createBusiness = expressAsyncHandler(async (req: Request, res: Response) => {
    const serviceProvider = await ServiceProvider.findById(req.userId);
    logger.debug(req.userId);
    if (!serviceProvider) {
        throw createHttpError(404, 'Service Provider not found');
    }
    const isBusinessAlreadyExists = await Business.findOne({ userId: req.userId });
    logger.debug(isBusinessAlreadyExists);
    if (isBusinessAlreadyExists) {
        throw createHttpError(400, 'Business already exists');
    }
    const newBusiness = new Business({ ...req.body, userId: serviceProvider._id });
    await newBusiness.save();
    res.status(201).json({
        success: true,
        message: 'Business created successfully',
        business: newBusiness,
    });
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

// Update a business by ID
export const updateBusiness = expressAsyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.id)) {
        throw createHttpError(400, 'Invalid business ID');
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
        req.params.id,
        { ...req.body, userId: req.userId },
        { new: true, runValidators: true }
    );
    if (!updatedBusiness) {
        throw createHttpError(404, 'Business not found');
    }
    res.status(200).json({
        success: true,
        message: 'Business updated successfully',
        business: updatedBusiness,
    });
});

export const getBusinessesByUserId = expressAsyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw createHttpError(400, 'Invalid User ID');
    }

    // Find businesses by userId
    const business = await Business.findOne({ userId });
    if (!business) {
        throw createHttpError(404, 'No businesses found for the given userId');
    }

    res.status(200).json({
        success: true,
        business,
    });
});