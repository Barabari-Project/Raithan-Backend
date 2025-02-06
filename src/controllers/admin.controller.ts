import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import CallHistory from '../models/callHistory.model';
import ServiceProvider from '../models/serviceProvider.model';
import ServiceSeeker from '../models/serviceSeeker.model';
import { BusinessCategory } from '../types/business.types';
import { ProductStatus } from '../types/product.types';
import { IServiceProvider, ServiceProviderStatus } from '../types/provider.types';
import { formateProviderImage, formatProductImageUrls } from '../utils/formatImageUrl';
import { generateJwt } from '../utils/jwt';
import { modelMapping } from '../utils/modelMapping';
import { validateEmail } from '../utils/validation';
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
    ).populate('business');
    await formateProviderImage(updatedServiceProvider!);
    // return updatedServiceProvider!;
    res.status(200).json({ serviceProvider: updatedServiceProvider });
});

export const blockServiceProvider = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceProvider = await ServiceProvider.findById(id);
    if (!serviceProvider) {
        throw createHttpError(404, "Service provider not found");
    }
    await ServiceProvider.findByIdAndUpdate(id, { $set: { status: ServiceProviderStatus.BLOCKED } });
    if (serviceProvider.business) {
        const productPromises: Promise<any>[] = [];
        for (const category in modelMapping) {
            const model = modelMapping[category as BusinessCategory];
            const products = await model.find({ business: serviceProvider.business });
            products.forEach((product: any) => {
                product.verificationStatus = ProductStatus.BLOCKED;
                productPromises.push(product.save());
            });
        }
        await Promise.all(productPromises);
    }

    res.status(200).json({ message: "Service provider blocked successfully" });
});

export const unblockServiceProvider = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await ServiceProvider.findByIdAndUpdate(id, { $set: { status: ServiceProviderStatus.VERIFIED } });
    res.status(200).json({ message: "Service provider unblocked successfully" });
});

export const getServiceSeekers = expressAsyncHandler(async (req: Request, res: Response) => {
    const serviceSeekers = await ServiceSeeker.find();
    res.status(200).json(serviceSeekers);
});

export const updateProductStatus = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id: productId, category } = req.params;
    const { status } = req.body;
    if (!Object.values(ProductStatus).includes(status)) {
        throw createHttpError(400, "Invalid status provided");
    }

    if (!Object.values(BusinessCategory).includes(category as BusinessCategory)) {
        throw createHttpError(400, "Invalid category");
    }

    if (!isValidObjectId(productId)) {
        throw createHttpError(400, "Invalid product ID");
    }
    let product;

    const model = modelMapping[category as BusinessCategory];
    if (!model) {
        throw createHttpError(400, "Invalid category");
    }

    product = await model.findByIdAndUpdate(productId, { $set: { verificationStatus: status } }, { new: true, runValidators: true });
    if (!product) {
        throw createHttpError(404, "Product not found");
    }

    await formatProductImageUrls(product);
    res.status(200).json({ product });
});

export const getProductByStatusAndCategoryAndBusinessId = expressAsyncHandler(async (req: Request, res: Response) => {
    const { category, status, business } = req.query;
    if (status && !Object.values(ProductStatus).includes(status as ProductStatus)) {
        throw createHttpError(400, "Invalid status");
    }
    const products = await findProductsByStatus(category as BusinessCategory, status as ProductStatus, business as string);
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