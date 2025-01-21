"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateProduct = exports.uploadImages = exports.updateProduct = exports.createProduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const mongodb_1 = require("mongodb");
const mongoose_1 = __importStar(require("mongoose"));
const business_model_1 = require("../../models/business.model");
const AgricultureLaborProduct_model_1 = require("../../models/products/AgricultureLaborProduct.model");
const DroneProduct_model_1 = require("../../models/products/DroneProduct.model");
const earthMoverProduct_model_1 = require("../../models/products/earthMoverProduct.model");
const harvestorProduct_model_1 = require("../../models/products/harvestorProduct.model");
const ImplementProduct_model_1 = require("../../models/products/ImplementProduct.model");
const MachineProduct_model_1 = require("../../models/products/MachineProduct.model");
const MechanicProduct_model_1 = require("../../models/products/MechanicProduct.model");
const PaddyTransplantorProduct_model_1 = require("../../models/products/PaddyTransplantorProduct.model");
const serviceProvider_model_1 = __importDefault(require("../../models/serviceProvider.model"));
const business_types_1 = require("../../types/business.types");
const product_types_1 = require("../../types/product.types");
const modelMapping_1 = require("../../utils/modelMapping");
const provider_types_1 = require("../../types/provider.types");
const formatImageUrl_1 = require("../../utils/formatImageUrl");
const s3Upload_1 = require("../../utils/s3Upload");
exports.createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.body;
    if (!Object.values(business_types_1.BusinessCategory).includes(category)) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    let product = null;
    const userId = req.userId;
    const serviceProvider = yield serviceProvider_model_1.default.findById(userId);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    if (serviceProvider.status === provider_types_1.ServiceProviderStatus.PENDING || serviceProvider.status === provider_types_1.ServiceProviderStatus.BUSINESS_DETAILS_REMAINING ||
        serviceProvider.status === provider_types_1.ServiceProviderStatus.OTP_VERIFIED || serviceProvider.status === provider_types_1.ServiceProviderStatus.REJECTED) {
        throw (0, http_errors_1.default)(400, "You are not allowed to create product. Please Complete your profile first.");
    }
    const business = yield business_model_1.Business.findOne({ serviceProvider: serviceProvider._id });
    if (!business) {
        throw (0, http_errors_1.default)(404, "Business not found");
    }
    if (!business.category.includes(category)) {
        business.category.push(category);
        yield business.save();
    }
    const _id = new mongodb_1.ObjectId();
    const files = req.files;
    const uploadedImages = yield (0, exports.uploadImages)(files, _id.toString());
    if (category === business_types_1.BusinessCategory.HARVESTORS || category === business_types_1.BusinessCategory.EARTH_MOVERS || category === business_types_1.BusinessCategory.IMPLEMENTS || category === business_types_1.BusinessCategory.MACHINES || category === business_types_1.BusinessCategory.PADDY_TRANSPLANTORS) {
        const requiredFields = ['front-view', 'back-view', 'left-view', 'right-view', 'driving-license', 'rc-book'];
        for (const field of requiredFields) {
            if (!files[field] || files[field].length === 0) {
                throw (0, http_errors_1.default)(400, `Missing required image: ${field}`);
            }
        }
        const { modelNo, hp, type } = req.body;
        const createData = Object.assign({ images: uploadedImages, _id,
            modelNo,
            hp, business: business._id }, (type && { type }));
        switch (category) {
            case business_types_1.BusinessCategory.HARVESTORS:
                product = yield harvestorProduct_model_1.HarvestorProduct.create(createData);
                break;
            case business_types_1.BusinessCategory.EARTH_MOVERS:
                product = yield earthMoverProduct_model_1.EarthMoverProduct.create(createData);
                break;
            case business_types_1.BusinessCategory.IMPLEMENTS:
                product = yield ImplementProduct_model_1.ImplementProduct.create(createData);
                break;
            case business_types_1.BusinessCategory.MACHINES:
                product = yield MachineProduct_model_1.MachineProduct.create(createData);
                break;
            case business_types_1.BusinessCategory.PADDY_TRANSPLANTORS:
                product = yield PaddyTransplantorProduct_model_1.PaddyTransplantorProduct.create(createData);
                break;
        }
    }
    else if (category === business_types_1.BusinessCategory.DRONES) {
        const requiredFields = ['front-view', 'back-view', 'left-view', 'right-view', 'bill'];
        for (const field of requiredFields) {
            if (!files[field] || files[field].length === 0) {
                throw (0, http_errors_1.default)(400, `Missing required image: ${field}`);
            }
        }
        const { type, modelNo } = req.body;
        product = yield DroneProduct_model_1.DroneProduct.create({
            images: uploadedImages,
            type,
            _id,
            modelNo,
            business: business._id,
        });
    }
    else if (category === business_types_1.BusinessCategory.MECHANICS || category === business_types_1.BusinessCategory.AGRICULTURE_LABOR) {
        const requiredField = 'e-shram-card';
        if (!files[requiredField] || files[requiredField].length === 0) {
            throw (0, http_errors_1.default)(400, `Missing required image: ${requiredField}`);
        }
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services } = req.body;
        services = JSON.parse(services);
        let { numberOfWorkers } = req.body;
        if (isIndividual == 'true')
            numberOfWorkers = 1;
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
        if (category === business_types_1.BusinessCategory.MECHANICS) {
            product = yield MechanicProduct_model_1.MechanicProduct.create(createData);
        }
        else {
            product = yield AgricultureLaborProduct_model_1.AgricultureLaborProduct.create(createData);
        }
    }
    else {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    yield (0, formatImageUrl_1.formatProductImageUrls)(product);
    res.status(201).json({ message: 'Product created successfully', product });
}));
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, id } = req.body;
    if (!Object.values(business_types_1.BusinessCategory).includes(category)) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    let product = null;
    const userId = req.userId;
    const serviceProvider = yield serviceProvider_model_1.default.findById(userId);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    if (serviceProvider.status === provider_types_1.ServiceProviderStatus.PENDING || serviceProvider.status === provider_types_1.ServiceProviderStatus.BUSINESS_DETAILS_REMAINING ||
        serviceProvider.status === provider_types_1.ServiceProviderStatus.OTP_VERIFIED || serviceProvider.status === provider_types_1.ServiceProviderStatus.REJECTED) {
        throw (0, http_errors_1.default)(400, "You are not allowed to update product. Please Complete your profile first.");
    }
    const business = yield business_model_1.Business.findOne({ serviceProvider: serviceProvider._id });
    if (!business) {
        throw (0, http_errors_1.default)(404, "Business not found");
    }
    if (!business.category.includes(category)) {
        throw (0, http_errors_1.default)(400, "Category not found in business");
    }
    const model = modelMapping_1.modelMapping[category];
    if (!model) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    product = yield model.findById(id);
    if (product == null) {
        throw (0, http_errors_1.default)(404, "Product not found");
    }
    const files = req.files;
    const uploadedImages = yield (0, exports.uploadImages)(files, id);
    for (const imageName in uploadedImages) {
        if (uploadedImages[imageName] === null) {
            uploadedImages[imageName] = product.images[imageName];
        }
    }
    if (category === business_types_1.BusinessCategory.HARVESTORS || category === business_types_1.BusinessCategory.EARTH_MOVERS || category === business_types_1.BusinessCategory.IMPLEMENTS || category === business_types_1.BusinessCategory.MACHINES || category === business_types_1.BusinessCategory.PADDY_TRANSPLANTORS) {
        const { modelNo, hp, type } = req.body;
        const createData = Object.assign(Object.assign({ images: uploadedImages, modelNo,
            hp }, (type && { type })), { verificationStatus: product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED });
        switch (category) {
            case business_types_1.BusinessCategory.HARVESTORS:
                product = yield harvestorProduct_model_1.HarvestorProduct.findByIdAndUpdate(id, { $set: createData }, { new: true, runValidators: true });
                break;
            case business_types_1.BusinessCategory.EARTH_MOVERS:
                product = yield earthMoverProduct_model_1.EarthMoverProduct.findByIdAndUpdate(id, { $set: createData }, { new: true, runValidators: true });
                break;
            case business_types_1.BusinessCategory.IMPLEMENTS:
                product = yield ImplementProduct_model_1.ImplementProduct.findByIdAndUpdate(id, { $set: createData }, { new: true, runValidators: true });
                break;
            case business_types_1.BusinessCategory.MACHINES:
                product = yield MachineProduct_model_1.MachineProduct.findByIdAndUpdate(id, { $set: createData }, { new: true, runValidators: true });
                break;
            case business_types_1.BusinessCategory.PADDY_TRANSPLANTORS:
                product = yield PaddyTransplantorProduct_model_1.PaddyTransplantorProduct.findByIdAndUpdate(id, { $set: createData }, { new: true, runValidators: true });
                break;
        }
    }
    else if (category === business_types_1.BusinessCategory.DRONES) {
        const { type, modelNo } = req.body;
        product = yield DroneProduct_model_1.DroneProduct.findByIdAndUpdate(id, {
            $set: {
                images: uploadedImages,
                type,
                modelNo,
                verificationStatus: product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED
            },
        }, { new: true, runValidators: true });
    }
    else if (category === business_types_1.BusinessCategory.MECHANICS || category === business_types_1.BusinessCategory.AGRICULTURE_LABOR) {
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services } = req.body;
        services = JSON.parse(services);
        let { numberOfWorkers } = req.body;
        if (isIndividual == 'true')
            numberOfWorkers = 1;
        const createData = {
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            numberOfWorkers,
            verificationStatus: product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED
        };
        if (category === business_types_1.BusinessCategory.MECHANICS) {
            product = yield MechanicProduct_model_1.MechanicProduct.findByIdAndUpdate(id, { $set: createData }, { new: true, runValidators: true });
        }
        else {
            product = yield AgricultureLaborProduct_model_1.AgricultureLaborProduct.findByIdAndUpdate(id, { $set: createData }, { new: true, runValidators: true });
        }
    }
    else {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    yield (0, formatImageUrl_1.formatProductImageUrls)(product);
    res.status(200).json({ message: 'Product updated successfully', product });
}));
const uploadImages = (files, id) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadImage = (file, folder, name) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, folder, `${id.toString()}-${name}`); });
    const uploadTasks = [
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
    const uploadedImagesArray = yield Promise.all(uploadTasks.map((task) => task.promise));
    const uploadedImages = uploadTasks.reduce((acc, task, index) => {
        acc[task.key] = uploadedImagesArray[index];
        return acc;
    }, {});
    return uploadedImages;
});
exports.uploadImages = uploadImages;
exports.rateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { productId, rating, category } = req.body;
    rating = parseInt(rating);
    if (isNaN(rating)) {
        throw (0, http_errors_1.default)(400, 'Rating must be a number');
    }
    if (rating < 0 || rating > 10) {
        throw (0, http_errors_1.default)(400, 'Rating must be between 0 and 10');
    }
    const userId = req.userId;
    if (!(0, mongoose_1.isValidObjectId)(productId)) {
        throw (0, http_errors_1.default)(400, 'Invalid product id');
    }
    if (!Object.values(business_types_1.BusinessCategory).includes(category)) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    let product;
    const model = modelMapping_1.modelMapping[category];
    if (!model) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    product = yield model.findById(productId);
    if (!product) {
        throw (0, http_errors_1.default)(404, 'Product not found');
    }
    else if (product.verificationStatus != product_types_1.ProductStatus.VERIFIED) {
        throw (0, http_errors_1.default)(400, 'Product is not verified');
    }
    if (product.ratings.find(r => r.userId.toString() == userId)) {
        throw (0, http_errors_1.default)(400, 'You have already rated this product');
    }
    product = yield model.findByIdAndUpdate(productId, {
        $set: {
            avgRating: (product.avgRating * product.ratings.length + rating) / (product.ratings.length + 1),
        },
        $push: {
            ratings: { userId: new mongoose_1.default.Types.ObjectId(userId), rating }
        }
    }, { new: true, runValidators: true });
    yield (0, formatImageUrl_1.formatProductImageUrls)(product);
    res.status(200).json({ message: 'Product rated successfully', product });
}));
