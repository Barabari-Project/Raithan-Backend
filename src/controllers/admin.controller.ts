import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { validateEmail } from '../utils/validation';
import { generateJwt } from '../utils/jwt';
import ServiceProvider from '../models/serviceProvider.model';
import { isValidObjectId } from 'mongoose';
import { ServiceProviderStatus } from '../types/provider.types';
import ServiceSeeker from '../models/serviceSeeker.model';
import { BusinessCategory } from '../types/business.types';
import { Business } from '../models/business.model';
import { HarvestorProduct } from '../models/products/harvestorProduct.model';
import { ImplementProduct } from '../models/products/ImplementProduct.model';
import { MachineProduct } from '../models/products/MachineProduct.model';
import { MechanicProduct } from '../models/products/MechanicProduct.model';
import { PaddyTransplantorProduct } from '../models/products/PaddyTransplantorProduct.model';
import { AgricultureLaborProduct } from '../models/products/AgricultureLaborProduct.model';
import { EarthMoverProduct } from '../models/products/earthMoverProduct.model';
import { DroneProduct } from '../models/products/DroneProduct.model';

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

export const getServiceProvidersByStatus = expressAsyncHandler(async (req: Request, res: Response) => {
    const { status } = req.params;

    // Check if the status is provided
    if (!status) {
        throw createHttpError(400, "Status query parameter is required.");
    }

    // Validate if the status is a valid value from ServiceProviderStatus enum
    if (!Object.values(ServiceProviderStatus).includes(status as ServiceProviderStatus)) {
        throw createHttpError(400, "Invalid status provided.");
    }

    // Fetch service providers with the valid status
    const serviceProviders = await ServiceProvider.find({ status: { $eq: status } });

    if (serviceProviders.length === 0) {
        throw createHttpError(404, "No service providers found with the given status.");
    }

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

export const verifyProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { category } = req.body;

    if (!isValidObjectId(id)) {
        throw createHttpError(400, "Invalid product ID");
    }

    const userId = req.userId;
    const serviceProvider = await ServiceProvider.findById(userId);
    let product;
    if (!serviceProvider) {
        throw createHttpError(404, "Service provider not found");
    }
    if (serviceProvider.status !== ServiceProviderStatus.VERIFIED) {
        throw createHttpError(400, "Service provider is not verified");
    }
    const business = await Business.findOne({ serviceProvider: serviceProvider._id });
    if (!business) {
        throw createHttpError(404, "Business not found");
    }
    if (!business.category.includes(category)) {
        throw createHttpError(400, "Business does not offer this category");
    }

    if (category === BusinessCategory.HARVESTORS) {
        product = await HarvestorProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.isVerified = true;
        await product.save();
    } else if (category === BusinessCategory.IMPLEMENTS) {
        product = await ImplementProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.isVerified = true;
        await product.save();
    } else if (category === BusinessCategory.MACHINES) {
        product = await MachineProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.isVerified = true;
        await product.save();
    } else if (category === BusinessCategory.MECHANICS) {
        product = await MechanicProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.isVerified = true;
        await product.save();
    } else if (category === BusinessCategory.PADDY_TRANSPLANTORS) {
        product = await PaddyTransplantorProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.isVerified = true;
        await product.save();
    } else if (category === BusinessCategory.AGRICULTURE_LABOR) {
        product = await AgricultureLaborProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.isVerified = true;
        await product.save();
    } else if (category === BusinessCategory.EARTH_MOVERS) {
        product = await EarthMoverProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.isVerified = true;
        await product.save();
    } else if (category === BusinessCategory.DRONES) {
        product = await DroneProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.isVerified = true;
        await product.save();
    }

    res.status(200).json({ product });
});
