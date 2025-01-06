import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import CallHistory from '../models/callHistory.model';
import { AgricultureLaborProduct } from '../models/products/AgricultureLaborProduct.model';
import { DroneProduct } from '../models/products/DroneProduct.model';
import { EarthMoverProduct } from '../models/products/earthMoverProduct.model';
import { HarvestorProduct } from '../models/products/harvestorProduct.model';
import { ImplementProduct } from '../models/products/ImplementProduct.model';
import { MachineProduct } from '../models/products/MachineProduct.model';
import { MechanicProduct } from '../models/products/MechanicProduct.model';
import { PaddyTransplantorProduct } from '../models/products/PaddyTransplantorProduct.model';
import ServiceProvider from '../models/serviceProvider.model';
import ServiceSeeker from '../models/serviceSeeker.model';
import { BusinessCategory } from '../types/business.types';
import { ProductStatus } from '../types/product.types';
import { IServiceProvider, ServiceProviderStatus } from '../types/provider.types';
import { formateProviderImage, formatProductImageUrls } from '../utils/formatImageUrl';
import { generateJwt } from '../utils/jwt';
import { validateEmail } from '../utils/validation';
import { findProductsByStatus } from './common.controller';
import { logger } from '..';

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
    for (const serviceProvider of serviceProviders) {
        await formateProviderImage(serviceProvider);
    }
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
    for (const serviceProvider of serviceProviders) {
        await formateProviderImage(serviceProvider);
    }
    res.status(200).json(serviceProviders);
});

export const updateServiceProviderStatus = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== ServiceProviderStatus.MODIFICATION_REQUIRED &&
        status !== ServiceProviderStatus.VERIFIED &&
        status !== ServiceProviderStatus.REJECTED) {
        throw createHttpError(400, "Invalid Status");
    }

    if (!isValidObjectId(id)) {
        throw createHttpError(400, "Invalid service provider ID");
    }

    const serviceProvider = await ServiceProvider.findById(id);

    if (!serviceProvider) {
        throw createHttpError(404, "Service provider not found");
    }

    if (serviceProvider.status !== ServiceProviderStatus.VERIFICATION_REQUIRED &&
        serviceProvider.status !== ServiceProviderStatus.RE_VERIFICATION_REQUIRED) {
        throw createHttpError(400, "Service provider is not pending verification");
    }

    const updatedServiceProvider: IServiceProvider | null = await ServiceProvider.findByIdAndUpdate(id,
        { $set: { status } },
        { new: true }
    );
    await formateProviderImage(updatedServiceProvider!);
    // return updatedServiceProvider!;
    res.status(200).json({ serviceProvider: updatedServiceProvider });
});

export const getServiceSeekers = expressAsyncHandler(async (req: Request, res: Response) => {
    const serviceSeekers = await ServiceSeeker.find();
    res.status(200).json(serviceSeekers);
});

export const verifyProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id: productId, category } = req.params;
    const product = await updateProductStatus(category, productId, ProductStatus.VERIFIED);
    res.status(200).json({ product });
});

export const rejectProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id: productId, category } = req.params;
    const product = await updateProductStatus(category, productId, ProductStatus.REJECTED);
    res.status(200).json({ product });
});

export const updateProductStatus = async (category: string, productId: string, status: ProductStatus) => {
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
    } else {
        throw createHttpError(400, "Invalid category");
    }
    await formatProductImageUrls(product);
    return product;
}

export const getProductByStatusAndCategory = expressAsyncHandler(async (req: Request, res: Response) => {
    const { category, status } = req.query;

    if (status && !Object.values(ProductStatus).includes(status as ProductStatus)) {
        throw createHttpError(400, "Invalid status");
    }
    const products = await findProductsByStatus(category as BusinessCategory, status as ProductStatus);
    res.status(200).json({ products });
});

export const getCallHistory = expressAsyncHandler(async (req: Request, res: Response) => {
    const callHistory = await CallHistory.find();
    res.status(200).json({ callHistory });
});

export const getCallHistoryByServiceSeekerId = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw createHttpError(400, "Invalid service seeker ID");
    }
    const callHistory = await CallHistory.find({ serviceSeeker: { $eq: id } });
    res.status(200).json({ callHistory });
});

export const getCallHistoryByServiceProviderId = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw createHttpError(400, "Invalid service provider ID");
    }
    const callHistory = await CallHistory.find({ serviceProvider: { $eq: id } });
    res.status(200).json({ callHistory });
});