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
import { ProductStatus } from '../types/product.types';
import { findProductsByStatus } from './common.controller';

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
    const { id: productId, category } = req.params;
    const userId = req.userId;
    const product = await updateProductStatus(category, productId, userId!, ProductStatus.VERIFIED);

    res.status(200).json({ product });
});

export const rejectProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id: productId, category } = req.params;
    const userId = req.userId;
    const product = await updateProductStatus(category, productId, userId!, ProductStatus.REJECTED);
    res.status(200).json({ product });
});

export const updateProductStatus = async (category: String, productId: String, userId: String, status: ProductStatus) => {
    if (!Object.values(BusinessCategory).includes(category as BusinessCategory)) {
        throw createHttpError(400, "Invalid category");
    }

    if (!isValidObjectId(productId)) {
        throw createHttpError(400, "Invalid product ID");
    }
    let product;

    if (category === BusinessCategory.HARVESTORS) {
        product = await HarvestorProduct.findById(productId);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.verificationStatus = status;
        await product.save();
    } else if (category === BusinessCategory.IMPLEMENTS) {
        product = await ImplementProduct.findById(productId);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.verificationStatus = status;
        await product.save();
    } else if (category === BusinessCategory.MACHINES) {
        product = await MachineProduct.findById(productId);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.verificationStatus = status;
        await product.save();
    } else if (category === BusinessCategory.MECHANICS) {
        product = await MechanicProduct.findById(productId);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.verificationStatus = status;
        await product.save();
    } else if (category === BusinessCategory.PADDY_TRANSPLANTORS) {
        product = await PaddyTransplantorProduct.findById(productId);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.verificationStatus = status;
        await product.save();
    } else if (category === BusinessCategory.AGRICULTURE_LABOR) {
        product = await AgricultureLaborProduct.findById(productId);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.verificationStatus = status;
        await product.save();
    } else if (category === BusinessCategory.EARTH_MOVERS) {
        product = await EarthMoverProduct.findById(productId);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.verificationStatus = status;
        await product.save();
    } else if (category === BusinessCategory.DRONES) {
        product = await DroneProduct.findById(productId);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        product.verificationStatus = status;
        await product.save();
    }
    return product;
}

export const getUnverifiedProducts = expressAsyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;
    const products = await findProductsByStatus(category, ProductStatus.UNVERIFIED);
    res.status(200).json({ products });
});