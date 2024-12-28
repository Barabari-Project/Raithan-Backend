import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import createHttpError from "http-errors";
import ServiceProvider from "../models/serviceProvider.model";
import ServiceSeeker from "../models/serviceSeeker.model";
import { Business } from "../models/business.model";
import { BusinessCategory } from "../types/business.types";
import { HarvestorProduct } from "../models/products/harvestorProduct.model";
import { ImplementProduct } from "../models/products/ImplementProduct.model";
import { MachineProduct } from "../models/products/MachineProduct.model";
import { MechanicProduct } from "../models/products/MechanicProduct.model";
import { DroneProduct } from "../models/products/DroneProduct.model";
import { AgricultureLaborProduct } from "../models/products/AgricultureLaborProduct.model";
import { PaddyTransplantorProduct } from "../models/products/PaddyTransplantorProduct.model";
import { EarthMoverProduct } from "../models/products/earthMoverProduct.model";
import { ProductStatus } from "../types/product.types";

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

    res.status(200).json({ serviceProvider });
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
    res.status(200).json({ business });
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
    res.status(200).json({ serviceSeeker });
});

export const getProductsByCategory = expressAsyncHandler(async (req: Request, res: Response) => {
    const { category } = req.params;
    const products = await findProductsByStatus(category, ProductStatus.VERIFIED)
    res.status(200).json({ products });
});


export const findProductsByStatus = async (category: String, status: ProductStatus): Promise<any> => {
    if (!Object.values(BusinessCategory).includes(category as BusinessCategory)) {
        throw createHttpError(400, "Invalid category");
    }

    let products;
    if (category === BusinessCategory.HARVESTORS) {
        products = await HarvestorProduct.find({ isVerified: true });
    } else if (category === BusinessCategory.IMPLEMENTS) {
        products = await ImplementProduct.find({ isVerified: true });
    } else if (category === BusinessCategory.MACHINES) {
        products = await MachineProduct.find({ isVerified: true });
    } else if (category === BusinessCategory.MECHANICS) {
        products = await MechanicProduct.find({ isVerified: true });
    } else if (category === BusinessCategory.PADDY_TRANSPLANTORS) {
        products = await PaddyTransplantorProduct.find({ isVerified: true });
    } else if (category === BusinessCategory.AGRICULTURE_LABOR) {
        products = await AgricultureLaborProduct.find({ isVerified: true });
    } else if (category === BusinessCategory.EARTH_MOVERS) {
        products = await EarthMoverProduct.find({ isVerified: true });
    } else if (category === BusinessCategory.DRONES) {
        products = await DroneProduct.find({ isVerified: true });
    }
    return products;
};
