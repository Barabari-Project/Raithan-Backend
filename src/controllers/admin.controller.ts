import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { validateEmail } from '../utils/validation';
import { generateJwt } from '../utils/jwt';
import ServiceProvider from '../models/serviceProvider.model';
import { isValidObjectId } from 'mongoose';
import { ServiceProviderStatus } from '../types/provider.types';
import ServiceSeeker from '../models/serviceSeeker.model';

export const login = expressAsyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
        throw createHttpError(400, "Invalid email format");
    }

    if (email == process.env.EMAIL && password == process.env.PASSWORD) {
        const token = generateJwt({ userId: process.env.ADMIN_ID! }, process.env.ADMIN_JWT_SECRET!);
        res.status(200).json({ token });
    }
    else {
        throw createHttpError(401, "Invalid credentials");
    }
});

export const getServiceProviders = expressAsyncHandler(async (req: Request, res: Response) => {
    const serviceProviders = await ServiceProvider.find();
    res.status(200).json(serviceProviders);
});

export const getServiceProvidersPendingVerification = expressAsyncHandler(async (req: Request, res: Response) => {
    const serviceProviders = await ServiceProvider.find({ status: ServiceProviderStatus.COMPLETED });
    res.status(200).json(serviceProviders);
});

export const verifyServiceProvider = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    // Validate the id parameter
    if (!isValidObjectId(id)) {
        throw createHttpError(400, "Invalid service provider ID");
    }
    const serviceProvider = await ServiceProvider.findById(id);
    if (!serviceProvider) {
        throw createHttpError(404, "Service provider not found");
    }
    if (serviceProvider.status !== ServiceProviderStatus.COMPLETED) {
        throw createHttpError(400, "Service provider is not pending verification");
    }
    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(id, { status: ServiceProviderStatus.VERIFIED }, { new: true });
    res.status(200).json({ serviceProvider: updatedServiceProvider });
});

export const rejectServiceProvider = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw createHttpError(400, "Invalid service provider ID");
    }
    const serviceProvider = await ServiceProvider.findById(id);
    if (!serviceProvider) {
        throw createHttpError(404, "Service provider not found");
    }
    if (serviceProvider.status !== ServiceProviderStatus.COMPLETED) {
        throw createHttpError(400, "Service provider is not pending verification");
    }
    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(id, { status: ServiceProviderStatus.REJECTED }, { new: true });
    res.status(200).json({ serviceProvider: updatedServiceProvider });
});

export const getServiceSeekers = expressAsyncHandler(async (req: Request, res: Response) => {
    const serviceSeekers = await ServiceSeeker.find();
    res.status(200).json(serviceSeekers);
});