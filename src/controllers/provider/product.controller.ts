import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { BusinessCategory } from "../../types/business.types";
import createHttpError from "http-errors";
import { uploadFileToS3 } from "../../utils/s3Upload";
import { HarvestorProduct } from "../../models/products/harvestorProduct.model";
import { Business } from "../../models/business.model";
import { EarthMoverProduct } from "../../models/products/earthMoverProduct.model";
import { ImplementProduct } from "../../models/products/ImplementProduct.model";
import { MachineProduct } from "../../models/products/MachineProduct.model";
import { PaddyTransplantorProduct } from "../../models/products/PaddyTransplantorProduct.model";
import { DroneProduct } from "../../models/products/DroneProduct.model";
import { MechanicProduct } from "../../models/products/MechanicProduct.model";
import { AgricultureLaborProduct } from "../../models/products/AgricultureLaborProduct.model";
import ServiceProvider from "../../models/serviceProvider.model";
import { ServiceProviderStatus } from "../../types/provider.types";
import { logger } from "../..";

export const createProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    const { category } = req.body;

    if (!Object.values(BusinessCategory).includes(category)) {
        throw createHttpError(400, "Invalid category");
    }
    let product;
    const userId = req.userId;
    const serviceProvider = await ServiceProvider.findById(userId);
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
        business.category.push(category);
        await business.save();
    }

    if (category === BusinessCategory.HARVESTORS) {
        const { hp, modelNo, type } = req.body;
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length === 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product-images'));
        product = await HarvestorProduct.create({
            images,
            hp,
            modelNo,
            business: business._id,
            type: type
        });
        res.status(201).json({ message: 'Product created successfully', product });
    } else if (category === BusinessCategory.EARTH_MOVERS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length === 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product-images'));
        const { modelNo, hp, type } = req.body;
        product = await EarthMoverProduct.create({
            images,
            modelNo,
            hp,
            business: business._id,
            type: type
        });
        res.status(201).json({ message: 'Product created successfully', product });
    } else if (category === BusinessCategory.IMPLEMENTS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length === 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product-images'));
        const { modelNo, hp, type } = req.body;
        product = await ImplementProduct.create({
            images,
            modelNo,
            hp,
            business: business._id
        });
    } else if (category === BusinessCategory.MACHINES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length === 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product-images'));
        const { modelNo, hp, type } = req.body;
        product = await MachineProduct.create({
            images,
            modelNo,
            hp,
            business: business._id,
        });
    } else if (category === BusinessCategory.PADDY_TRANSPLANTORS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length === 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product-images'));
        const { modelNo, hp } = req.body;
        product = await PaddyTransplantorProduct.create({
            images,
            modelNo,
            hp,
            business: business._id,
        });
    } else if (category === BusinessCategory.DRONES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length === 5) {
            // 4 photos from 4 directions and 1 bill
            throw createHttpError(400, 'You need to upload 5 images');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product-images'));
        const { type, modelNo } = req.body;
        product = await DroneProduct.create({
            images,
            type,
            modelNo,
            business: business._id,
        });
    } else if (category === BusinessCategory.MECHANICS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        // eShram card 
        if (req.files.length === 1) {
            throw createHttpError(400, 'You need to upload 1 image');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product-images'));
        const { eShramCardNumber, readyToTravelIn10Km, isIndividual, services } = req.body;
        product = await MechanicProduct.create({
            images,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            business: business._id,
        });
    } else if (category === BusinessCategory.AGRICULTURE_LABOR) {
        const { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers } = req.body;
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        // eShram card 
        if (req.files.length === 1) {
            throw createHttpError(400, 'You need to upload 1 image');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product-images'));
        product = await AgricultureLaborProduct.create({
            images,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            numberOfWorkers,
            business: business._id,
        });
    } else {
        throw createHttpError(400, "Invalid category");
    }
    res.status(201).json({ message: 'Product created successfully', product });
});