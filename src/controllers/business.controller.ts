import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { Business } from '../models/business.model';
import { isValidObjectId } from 'mongoose';
import ServiceProvider from '../models/serviceProvider.model';
import expressAsyncHandler from 'express-async-handler';
import { logger } from '..';
import { ServiceProviderStatus } from '../types/provider.types';

// Create a new business
export const createBusiness = expressAsyncHandler(async (req: Request, res: Response) => {
    const serviceProvider = await ServiceProvider.findById(req.userId);

    if (!serviceProvider) {
        throw createHttpError(404, 'Service Provider not found');
    }

    if (serviceProvider.status !== ServiceProviderStatus.BUSINESS_DETAILS_REMAINING) {
        throw createHttpError(400, 'Service Provider is not in business details remaining state');
    }

    const isBusinessAlreadyExists = await Business.findOne({ serviceProvider: serviceProvider._id });

    if (isBusinessAlreadyExists) {
        throw createHttpError(400, 'Business already exists');
    }
    const newBusiness = new Business({ ...req.body, serviceProvider: serviceProvider._id });
    await newBusiness.save();

    serviceProvider.business = newBusiness._id;
    serviceProvider.status = ServiceProviderStatus.COMPLETED;
    await serviceProvider.save();

    res.status(201).json({
        success: true,
        message: 'Business created successfully',
        business: newBusiness,
    });
});

// Update a business by ID
export const updateBusiness = expressAsyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.id)) {
        throw createHttpError(400, 'Invalid business ID');
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
        req.params.id,
        { $set: { ...req.body, serviceProvider: req.userId } },
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