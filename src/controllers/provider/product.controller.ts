import { Request, Response } from "express";
import { ObjectId } from 'mongodb';
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
import { isValidObjectId } from "mongoose";
import { IAgricultureLaborProduct, IDroneProduct, IEarthMoverProduct, IHarvestorProduct, IImplementProduct, IMachineProduct, IMechanicProduct, IPaddyTransplantorProduct, ProductStatus } from "../../types/product.types";

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
    const _id = new ObjectId();

    if (category === BusinessCategory.HARVESTORS) {
        const { hp, modelNo, type } = req.body;
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index));
        const uploadedImages = await Promise.all(images);
        product = await HarvestorProduct.create({
            images: uploadedImages,
            hp,
            _id,
            modelNo,
            business: business._id,
            type: type
        });
    } else if (category === BusinessCategory.EARTH_MOVERS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index));
        const uploadedImages = await Promise.all(images);
        const { modelNo, hp, type } = req.body;
        product = await EarthMoverProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            _id,
            business: business._id,
            type: type
        });
    } else if (category === BusinessCategory.IMPLEMENTS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index));
        const uploadedImages = await Promise.all(images);
        const { modelNo, hp } = req.body;
        product = await ImplementProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            _id,
            business: business._id
        });
    } else if (category === BusinessCategory.MACHINES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index));
        const uploadedImages = await Promise.all(images);
        const { modelNo, hp } = req.body;
        product = await MachineProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            _id,
            business: business._id,
        });
    } else if (category === BusinessCategory.PADDY_TRANSPLANTORS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index));
        const uploadedImages = await Promise.all(images);
        const { modelNo, hp } = req.body;
        product = await PaddyTransplantorProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            _id,
            business: business._id,
        });
    } else if (category === BusinessCategory.DRONES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 5) {
            // 4 photos from 4 directions and 1 bill
            throw createHttpError(400, 'You need to upload 5 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index));
        const uploadedImages = await Promise.all(images);
        const { type, modelNo } = req.body;
        product = await DroneProduct.create({
            images: uploadedImages,
            type,
            _id,
            modelNo,
            business: business._id,
        });
    } else if (category === BusinessCategory.MECHANICS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw createHttpError(400, 'You need to upload 1 image');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, 'product/secured/user-data', _id.toString() + index));
        const uploadedImages = await Promise.all(images);
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers } = req.body;
        if (isIndividual) {
            numberOfWorkers = 1;
        }
        product = await MechanicProduct.create({
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            _id,
            isIndividual,
            services,
            numberOfWorkers,
            business: business._id,
        });
    } else if (category === BusinessCategory.AGRICULTURE_LABOR) {
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
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, 'product/secured/user-data', _id.toString() + index));
        const uploadedImages = await Promise.all(images);
        product = await AgricultureLaborProduct.create({
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            _id,
            numberOfWorkers,
            business: business._id,
        });
    } else {
        throw createHttpError(400, "Invalid category");
    }
    await formatProductImageUrls(product);
    res.status(201).json({ message: 'Product created successfully', product });
});

export const updateProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    const { category } = req.body;

    if (!Object.values(BusinessCategory).includes(category)) {
        throw createHttpError(400, "Invalid category");
    }
    let product: IAgricultureLaborProduct | IDroneProduct | IEarthMoverProduct | IHarvestorProduct | IImplementProduct | IMachineProduct | IMechanicProduct | IPaddyTransplantorProduct | null;
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
        throw createHttpError(400, "Category not found in business");
    }

    if (category === BusinessCategory.HARVESTORS) {
        const { hp, modelNo, type, id } = req.body;
        if (!isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id");
        }
        product = await HarvestorProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product!._id.toString() + index));
        const uploadedImages = await Promise.all(images);
        product = await HarvestorProduct.findByIdAndUpdate(product!._id, {
            images: uploadedImages,
            hp,
            modelNo,
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED,
            business: business._id,
            type: type
        }, { new: true });
    } else if (category === BusinessCategory.EARTH_MOVERS) {
        const { modelNo, hp, type, id } = req.body;
        if (!isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id");
        }
        product = await EarthMoverProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product!._id.toString() + index));
        const uploadedImages = await Promise.all(images);
        product = await EarthMoverProduct.findByIdAndUpdate(product!._id, {
            images: uploadedImages,
            modelNo,
            hp,
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED,
            business: business._id,
            type: type
        }, { new: true });
    } else if (category === BusinessCategory.IMPLEMENTS) {
        const { modelNo, hp, id } = req.body;
        if (!isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id");
        }
        product = await ImplementProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product!._id.toString() + index));
        const uploadedImages = await Promise.all(images);
        product = await ImplementProduct.findByIdAndUpdate(product!._id, {
            images: uploadedImages,
            modelNo,
            hp,
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED,
            business: business._id
        }, { new: true });
    } else if (category === BusinessCategory.MACHINES) {
        const { modelNo, hp, id } = req.body;
        if (!isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id");
        }
        product = await MachineProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product!._id.toString() + index));
        const uploadedImages = await Promise.all(images);
        product = await MachineProduct.findByIdAndUpdate(product!._id, {
            images: uploadedImages,
            modelNo,
            hp,
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED,
            business: business._id,
        }, { new: true });
    } else if (category === BusinessCategory.PADDY_TRANSPLANTORS) {
        const { modelNo, hp, id } = req.body;
        if (!isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id");
        }
        product = await PaddyTransplantorProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw createHttpError(400, 'You need to upload 6 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product!._id.toString() + index));
        const uploadedImages = await Promise.all(images);
        product = await PaddyTransplantorProduct.findByIdAndUpdate(product._id, {
            images: uploadedImages,
            modelNo,
            hp,
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED,
            business: business._id,
        }, { new: true });
    } else if (category === BusinessCategory.DRONES) {
        const { type, modelNo, id } = req.body;
        if (!isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id");
        }
        product = await DroneProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        } else if (req.files.length !== 5) {
            // 4 photos from 4 directions and 1 bill
            throw createHttpError(400, 'You need to upload 5 images');
        }
        const images = req.files.map(async (file, index) => await uploadFileToS3(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product!._id.toString() + index));
        const uploadedImages = await Promise.all(images);
        product = await DroneProduct.findByIdAndUpdate(product._id, {
            images: uploadedImages,
            type,
            modelNo,
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED,
            business: business._id,
        }, { new: true });
    } else if (category === BusinessCategory.MECHANICS) {
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers, id } = req.body;
        if (!isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id");
        }
        product = await MechanicProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw createHttpError(400, 'Profile picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw createHttpError(400, 'You need to upload 1 image');
        }
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product/secured/user-data', product!._id.toString()));
        const uploadedImages = await Promise.all(images);
        if (isIndividual) {
            numberOfWorkers = 1;
        }
        product = await MechanicProduct.findByIdAndUpdate(product._id, {
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            numberOfWorkers,
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED,
            business: business._id,
        }, { new: true });
    } else if (category === BusinessCategory.AGRICULTURE_LABOR) {
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers, id } = req.body;
        if (!isValidObjectId(id)) {
            throw createHttpError(400, "Invalid id");
        }
        product = await AgricultureLaborProduct.findById(id);
        if (!product) {
            throw createHttpError(404, "Product not found");
        }
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
        const images = req.files.map(async (file) => await uploadFileToS3(file, 'product/secured/user-data', product!._id.toString()));
        const uploadedImages = await Promise.all(images);
        product = await AgricultureLaborProduct.findByIdAndUpdate(product._id, {
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED,
            numberOfWorkers,
            business: business._id,
        }, { new: true });
    } else {
        throw createHttpError(400, "Invalid category");
    }
    await formatProductImageUrls(product!);
    res.status(201).json({ message: 'Product created successfully', product });
})