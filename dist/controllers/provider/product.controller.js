import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { Business } from "../../models/business.model";
import { AgricultureLaborProduct } from "../../models/products/AgricultureLaborProduct.model";
import { DroneProduct } from "../../models/products/DroneProduct.model";
import { EarthMoverProduct } from "../../models/products/earthMoverProduct.model";
import { HarvestorProduct } from "../../models/products/harvestorProduct.model";
import { ImplementProduct } from "../../models/products/ImplementProduct.model";
import { MachineProduct } from "../../models/products/MachineProduct.model";
import { MechanicProduct } from "../../models/products/MechanicProduct.model";
import { PaddyTransplantorProduct } from "../../models/products/PaddyTransplantorProduct.model";
import ServiceProvider from "../../models/serviceProvider.model";
import { BusinessCategory } from "../../types/business.types";
import { ServiceProviderStatus } from "../../types/provider.types";
import { uploadFileToS3 } from "../../utils/s3Upload";
import { formatProductImageUrls } from "../../utils/formatImageUrl";
export const createProduct = expressAsyncHandler(async (req, res) => {
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
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data'));
        const uploadedImages = await Promise.all(images);
        product = await HarvestorProduct.create({
            images: uploadedImages,
            hp,
            modelNo,
            business: business._id,
            type: type
        });
    }
    else if (category === BusinessCategory.EARTH_MOVERS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data'));
        const uploadedImages = await Promise.all(images);
        const { modelNo, hp, type } = req.body;
        product = await EarthMoverProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            business: business._id,
            type: type
        });
    }
    else if (category === BusinessCategory.IMPLEMENTS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data'));
        const uploadedImages = await Promise.all(images);
        const { modelNo, hp } = req.body;
        product = await ImplementProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            business: business._id
        });
    }
    else if (category === BusinessCategory.MACHINES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data'));
        const uploadedImages = await Promise.all(images);
        const { modelNo, hp } = req.body;
        product = await MachineProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            business: business._id,
        });
    }
    else if (category === BusinessCategory.PADDY_TRANSPLANTORS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data'));
        const uploadedImages = await Promise.all(images);
        const { modelNo, hp } = req.body;
        product = await PaddyTransplantorProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            business: business._id,
        });
    }
    else if (category === BusinessCategory.DRONES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        else if (req.files.length !== 5) {
            // 4 photos from 4 directions and 1 bill
            throw createHttpError(400, 'You need to upload 5 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data'));
        const uploadedImages = await Promise.all(images);
        const { type, modelNo } = req.body;
        product = await DroneProduct.create({
            images: uploadedImages,
            type,
            modelNo,
            business: business._id,
        });
    }
    else if (category === BusinessCategory.MECHANICS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw createHttpError(400, 'You need to upload 1 image');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product/secured/user-data'));
        const uploadedImages = await Promise.all(images);
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers } = req.body;
        if (isIndividual) {
            numberOfWorkers = 1;
        }
        product = await MechanicProduct.create({
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            numberOfWorkers,
            business: business._id,
        });
    }
    else if (category === BusinessCategory.AGRICULTURE_LABOR) {
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers } = req.body;
        if (isIndividual) {
            numberOfWorkers = 1;
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw createHttpError(400, 'You need to upload 1 image');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product/secured/user-data'));
        const uploadedImages = await Promise.all(images);
        product = await AgricultureLaborProduct.create({
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            numberOfWorkers,
            business: business._id,
        });
    }
    else {
        throw createHttpError(400, "Invalid category");
    }
    await formatProductImageUrls(product);
    res.status(201).json({ message: 'Product created successfully', product });
});
