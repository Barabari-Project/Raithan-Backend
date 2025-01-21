import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { ObjectId } from 'mongodb';
import mongoose, { isValidObjectId } from "mongoose";
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
import { ProductStatus, ProductType, UploadedImages } from "../../types/product.types";
import { modelMapping } from '../../utils/modelMapping';
import { ServiceProviderStatus } from "../../types/provider.types";
import { formatProductImageUrls } from "../../utils/formatImageUrl";
import { uploadFileToS3 } from "../../utils/s3Upload";


export const createProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    const { category } = req.body;

    if (!Object.values(BusinessCategory).includes(category)) {
        throw createHttpError(400, "Invalid category");
    }

    let product: ProductType | null = null;
    const userId = req.userId;
    const serviceProvider = await ServiceProvider.findById(userId);

    if (!serviceProvider) {
        throw createHttpError(404, "Service provider not found");
    }

    if (serviceProvider.status === ServiceProviderStatus.PENDING || serviceProvider.status === ServiceProviderStatus.BUSINESS_DETAILS_REMAINING ||
        serviceProvider.status === ServiceProviderStatus.OTP_VERIFIED || serviceProvider.status === ServiceProviderStatus.REJECTED
    ) {
        throw createHttpError(400, "You are not allowed to create product. Please Complete your profile first.");
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
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const uploadedImages: UploadedImages = await uploadImages(files, _id.toString());

    if (category === BusinessCategory.HARVESTORS || category === BusinessCategory.EARTH_MOVERS || category === BusinessCategory.IMPLEMENTS || category === BusinessCategory.MACHINES || category === BusinessCategory.PADDY_TRANSPLANTORS) {
        const requiredFields = ['front-view', 'back-view', 'left-view', 'right-view', 'driving-license', 'rc-book'];
        for (const field of requiredFields) {
            if (!files[field] || files[field].length === 0) {
                throw createHttpError(400, `Missing required image: ${field}`);
            }
        }


        const { modelNo, hp, type } = req.body;
        const createData = {
            images: uploadedImages,
            _id,
            modelNo,
            hp,
            business: business._id,
            ...(type && { type }),
        };

        switch (category) {
            case BusinessCategory.HARVESTORS:
                product = await HarvestorProduct.create(createData);
                break;
            case BusinessCategory.EARTH_MOVERS:
                product = await EarthMoverProduct.create(createData);
                break;
            case BusinessCategory.IMPLEMENTS:
                product = await ImplementProduct.create(createData);
                break;
            case BusinessCategory.MACHINES:
                product = await MachineProduct.create(createData);
                break;
            case BusinessCategory.PADDY_TRANSPLANTORS:
                product = await PaddyTransplantorProduct.create(createData);
                break;
        }
    } else if (category === BusinessCategory.DRONES) {
        const requiredFields = ['front-view', 'back-view', 'left-view', 'right-view', 'bill'];
        for (const field of requiredFields) {
            if (!files[field] || files[field].length === 0) {
                throw createHttpError(400, `Missing required image: ${field}`);
            }
        }

        const { type, modelNo } = req.body;
        product = await DroneProduct.create({
            images: uploadedImages,
            type,
            _id,
            modelNo,
            business: business._id,
        });
    } else if (category === BusinessCategory.MECHANICS || category === BusinessCategory.AGRICULTURE_LABOR) {
        const requiredField = 'e-shram-card';
        if (!files[requiredField] || files[requiredField].length === 0) {
            throw createHttpError(400, `Missing required image: ${requiredField}`);
        }

        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services } = req.body;

        services = JSON.parse(services);

        let { numberOfWorkers } = req.body;
        if (isIndividual == 'true') numberOfWorkers = 1;

        const createData = {
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            _id,
            numberOfWorkers,
            business: business._id,
        };

        if (category === BusinessCategory.MECHANICS) {
            product = await MechanicProduct.create(createData);
        } else {
            product = await AgricultureLaborProduct.create(createData);
        }
    } else {
        throw createHttpError(400, "Invalid category");
    }

    await formatProductImageUrls(product!);
    res.status(201).json({ message: 'Product created successfully', product });
});


export const updateProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    const { category, id } = req.body;

    if (!Object.values(BusinessCategory).includes(category)) {
        throw createHttpError(400, "Invalid category");
    }
    let product: ProductType | null = null;
    const userId = req.userId;

    const serviceProvider = await ServiceProvider.findById(userId);
    if (!serviceProvider) {
        throw createHttpError(404, "Service provider not found");
    }
    if (serviceProvider.status === ServiceProviderStatus.PENDING || serviceProvider.status === ServiceProviderStatus.BUSINESS_DETAILS_REMAINING ||
        serviceProvider.status === ServiceProviderStatus.OTP_VERIFIED || serviceProvider.status === ServiceProviderStatus.REJECTED
    ) {
        throw createHttpError(400, "You are not allowed to update product. Please Complete your profile first.");
    }
    const business = await Business.findOne({ serviceProvider: serviceProvider._id });
    if (!business) {
        throw createHttpError(404, "Business not found");
    }
    if (!business.category.includes(category)) {
        throw createHttpError(400, "Category not found in business");
    }

    const model = modelMapping[category as BusinessCategory];
    if (!model) {
        throw createHttpError(400, "Invalid category");
    }

    product = await model.findById(id);

    if (product == null) {
        throw createHttpError(404, "Product not found");
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const uploadedImages: UploadedImages = await uploadImages(files, id);
    for (const imageName in uploadedImages) {
        if (uploadedImages[imageName as keyof UploadedImages] === null) {
            uploadedImages[imageName as keyof UploadedImages] = product.images[imageName as keyof UploadedImages];
        }
    }

    if (category === BusinessCategory.HARVESTORS || category === BusinessCategory.EARTH_MOVERS || category === BusinessCategory.IMPLEMENTS || category === BusinessCategory.MACHINES || category === BusinessCategory.PADDY_TRANSPLANTORS) {


        const { modelNo, hp, type } = req.body;
        const createData = {
            images: uploadedImages,
            modelNo,
            hp,
            ...(type && { type }),
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED
        };

        switch (category) {
            case BusinessCategory.HARVESTORS:
                product = await HarvestorProduct.findByIdAndUpdate(
                    id,
                    { $set: createData },
                    { new: true, runValidators: true }
                );
                break;
            case BusinessCategory.EARTH_MOVERS:
                product = await EarthMoverProduct.findByIdAndUpdate(
                    id,
                    { $set: createData },
                    { new: true, runValidators: true }
                );
                break;
            case BusinessCategory.IMPLEMENTS:
                product = await ImplementProduct.findByIdAndUpdate(
                    id,
                    { $set: createData },
                    { new: true, runValidators: true }
                );
                break;
            case BusinessCategory.MACHINES:
                product = await MachineProduct.findByIdAndUpdate(
                    id,
                    { $set: createData },
                    { new: true, runValidators: true }
                );
                break;
            case BusinessCategory.PADDY_TRANSPLANTORS:
                product = await PaddyTransplantorProduct.findByIdAndUpdate(
                    id,
                    { $set: createData },
                    { new: true, runValidators: true }
                );
                break;
        }
    } else if (category === BusinessCategory.DRONES) {

        const { type, modelNo } = req.body;

        product = await DroneProduct.findByIdAndUpdate(id, {
            $set: {
                images: uploadedImages,
                type,
                modelNo,
                verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED
            },
        }, { new: true, runValidators: true });
    } else if (category === BusinessCategory.MECHANICS || category === BusinessCategory.AGRICULTURE_LABOR) {


        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services } = req.body;
        services = JSON.parse(services);
        let { numberOfWorkers } = req.body;
        if (isIndividual == 'true') numberOfWorkers = 1;

        const createData = {
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            numberOfWorkers,
            verificationStatus: ProductStatus.RE_VERIFICATION_REQUIRED
        };

        if (category === BusinessCategory.MECHANICS) {
            product = await MechanicProduct.findByIdAndUpdate(id, { $set: createData }, { new: true, runValidators: true });
        } else {
            product = await AgricultureLaborProduct.findByIdAndUpdate(id, { $set: createData }, { new: true, runValidators: true });
        }
    } else {
        throw createHttpError(400, "Invalid category");
    }

    await formatProductImageUrls(product!);
    res.status(200).json({ message: 'Product updated successfully', product });
});

export const uploadImages = async (files: { [fieldname: string]: Express.Multer.File[] }, id: string) => {
    const uploadImage = async (file: Express.Multer.File, folder: string, name: string) =>
        await uploadFileToS3(file, folder, `${id.toString()}-${name}`);

    const uploadTasks: { key: keyof UploadedImages; promise: Promise<string | null> }[] = [
        {
            key: "front-view",
            promise: files['front-view'] && files['front-view'][0]
                ? uploadImage(files['front-view'][0], 'product/product-images', 'front-view')
                : Promise.resolve(null),
        },
        {
            key: "back-view",
            promise: files['back-view'] && files['back-view'][0]
                ? uploadImage(files['back-view'][0], 'product/product-images', 'back-view')
                : Promise.resolve(null),
        },
        {
            key: "left-view",
            promise: files['left-view'] && files['left-view'][0]
                ? uploadImage(files['left-view'][0], 'product/product-images', 'left-view')
                : Promise.resolve(null),
        },
        {
            key: "right-view",
            promise: files['right-view'] && files['right-view'][0]
                ? uploadImage(files['right-view'][0], 'product/product-images', 'right-view')
                : Promise.resolve(null),
        },
        {
            key: "driving-license",
            promise: files['driving-license'] && files['driving-license'][0]
                ? uploadImage(files['driving-license'][0], 'product/secured/user-data', 'driving-license')
                : Promise.resolve(null),
        },
        {
            key: "rc-book",
            promise: files['rc-book'] && files['rc-book'][0]
                ? uploadImage(files['rc-book'][0], 'product/secured/user-data', 'rc-book')
                : Promise.resolve(null),
        },
        {
            key: "bill",
            promise: files['bill'] && files['bill'][0]
                ? uploadImage(files['bill'][0], 'product/secured/user-data', 'bill')
                : Promise.resolve(null),
        },
        {
            key: "e-shram-card",
            promise: files['e-shram-card'] && files['e-shram-card'][0]
                ? uploadImage(files['e-shram-card'][0], 'product/secured/user-data', 'e-shram-card')
                : Promise.resolve(null),
        }
    ];

    // Execute all upload tasks in parallel
    const uploadedImagesArray = await Promise.all(
        uploadTasks.map((task) => task.promise)
    );

    const uploadedImages: UploadedImages = uploadTasks.reduce((acc, task, index) => {
        acc[task.key] = uploadedImagesArray[index];
        return acc;
    }, {} as UploadedImages);

    return uploadedImages;
}

export const rateProduct = expressAsyncHandler(async (req: Request, res: Response) => {
    let { productId, rating, category } = req.body;
    rating = parseInt(rating);
    if (isNaN(rating)) {
        throw createHttpError(400, 'Rating must be a number');
    }
    if (rating < 0 || rating > 10) {
        throw createHttpError(400, 'Rating must be between 0 and 10');
    }
    const userId = req.userId;
    if (!isValidObjectId(productId)) {
        throw createHttpError(400, 'Invalid product id');
    }
    if (!Object.values(BusinessCategory).includes(category)) {
        throw createHttpError(400, "Invalid category");
    }
    let product: ProductType | null;

    const model = modelMapping[category as BusinessCategory];
    if (!model) {
        throw createHttpError(400, "Invalid category");
    }

    product = await model.findById(productId);

    if (!product) {
        throw createHttpError(404, 'Product not found');
    } else if (product.verificationStatus != ProductStatus.VERIFIED) {
        throw createHttpError(400, 'Product is not verified');
    }
    if (product.ratings.find(r => r.userId.toString() == userId)) {
        throw createHttpError(400, 'You have already rated this product');
    }
    
    product = await model.findByIdAndUpdate(productId, {
        $set: {
            avgRating: (product.avgRating * product.ratings.length + rating) / (product.ratings.length + 1),
        },
        $push: {
            ratings: { userId: new mongoose.Types.ObjectId(userId), rating }
        }
    }, { new: true, runValidators: true });

    await formatProductImageUrls(product!);
    res.status(200).json({ message: 'Product rated successfully', product });
});