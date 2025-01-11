import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { Business } from '../../models/business.model';
import ServiceProvider from '../../models/serviceProvider.model';
import expressAsyncHandler from 'express-async-handler';
import { ServiceProviderStatus } from '../../types/provider.types';
import { logger } from '../..';

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
    serviceProvider.status = ServiceProviderStatus.VERIFICATION_REQUIRED;
    await serviceProvider.save();

    res.status(201).json({
        success: true,
        message: 'Business created successfully',
        business: newBusiness,
    });
});

export const setLocation = expressAsyncHandler(async (req: Request, res: Response) => {
    const { lat, lng } = req.body;
    const userId = req.userId;
    const provider = await ServiceProvider.findById(userId);
    await Business.findByIdAndUpdate(
        provider?.business,
        { $set: { location: { lat, lng } } },
        { runValidators: true }
    );
    res.sendStatus(200);
});


// Update a business by ID
export const updateBusiness = expressAsyncHandler(async (req: Request, res: Response) => {

    const serviceProvider = await ServiceProvider.findById(req.userId);
    if (!serviceProvider) {
        throw createHttpError(404, 'Service Provider not found');
    }
    if ((serviceProvider.status !== ServiceProviderStatus.VERIFICATION_REQUIRED &&
        serviceProvider.status !== ServiceProviderStatus.MODIFICATION_REQUIRED &&
        serviceProvider.status !== ServiceProviderStatus.VERIFIED &&
        serviceProvider.status !== ServiceProviderStatus.RE_VERIFICATION_REQUIRED
    )) {
        throw createHttpError(400, "You can not update a business details");
    }

    const updatedBusiness = await Business.findByIdAndUpdate(
        serviceProvider.business,
        { $set: { ...req.body, serviceProvider: req.userId } },
        { new: true, runValidators: true }
    );

    if (serviceProvider.status == ServiceProviderStatus.VERIFIED || serviceProvider.status == ServiceProviderStatus.MODIFICATION_REQUIRED) {
        serviceProvider.status = ServiceProviderStatus.RE_VERIFICATION_REQUIRED;
        await serviceProvider.save();
    }

    res.status(200).json({
        success: true,
        message: 'Business updated successfully',
        business: updatedBusiness,
    });
});