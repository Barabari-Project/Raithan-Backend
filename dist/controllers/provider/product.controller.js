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
exports.rateProduct = exports.updateProduct = exports.createProduct = void 0;
const mongodb_1 = require("mongodb");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
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
const provider_types_1 = require("../../types/provider.types");
const s3Upload_1 = require("../../utils/s3Upload");
const formatImageUrl_1 = require("../../utils/formatImageUrl");
const mongoose_1 = __importStar(require("mongoose"));
const product_types_1 = require("../../types/product.types");
exports.createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.body;
    if (!Object.values(business_types_1.BusinessCategory).includes(category)) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    let product;
    const userId = req.userId;
    const serviceProvider = yield serviceProvider_model_1.default.findById(userId);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    if (serviceProvider.status !== provider_types_1.ServiceProviderStatus.VERIFIED) {
        throw (0, http_errors_1.default)(400, "Service provider is not verified");
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
    if (category === business_types_1.BusinessCategory.HARVESTORS) {
        const { hp, modelNo, type } = req.body;
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        product = yield harvestorProduct_model_1.HarvestorProduct.create({
            images: uploadedImages,
            hp,
            _id,
            modelNo,
            business: business._id,
            type: type
        });
    }
    else if (category === business_types_1.BusinessCategory.EARTH_MOVERS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        const { modelNo, hp, type } = req.body;
        product = yield earthMoverProduct_model_1.EarthMoverProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            _id,
            business: business._id,
            type: type
        });
    }
    else if (category === business_types_1.BusinessCategory.IMPLEMENTS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        const { modelNo, hp } = req.body;
        product = yield ImplementProduct_model_1.ImplementProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            _id,
            business: business._id
        });
    }
    else if (category === business_types_1.BusinessCategory.MACHINES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        const { modelNo, hp } = req.body;
        product = yield MachineProduct_model_1.MachineProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            _id,
            business: business._id,
        });
    }
    else if (category === business_types_1.BusinessCategory.PADDY_TRANSPLANTORS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        const { modelNo, hp } = req.body;
        product = yield PaddyTransplantorProduct_model_1.PaddyTransplantorProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            _id,
            business: business._id,
        });
    }
    else if (category === business_types_1.BusinessCategory.DRONES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 5) {
            // 4 photos from 4 directions and 1 bill
            throw (0, http_errors_1.default)(400, 'You need to upload 5 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', _id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        const { type, modelNo } = req.body;
        product = yield DroneProduct_model_1.DroneProduct.create({
            images: uploadedImages,
            type,
            _id,
            modelNo,
            business: business._id,
        });
    }
    else if (category === business_types_1.BusinessCategory.MECHANICS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw (0, http_errors_1.default)(400, 'You need to upload 1 image');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product/secured/user-data', _id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers } = req.body;
        if (isIndividual) {
            numberOfWorkers = 1;
        }
        product = yield MechanicProduct_model_1.MechanicProduct.create({
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            _id,
            isIndividual,
            services,
            numberOfWorkers,
            business: business._id,
        });
    }
    else if (category === business_types_1.BusinessCategory.AGRICULTURE_LABOR) {
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers } = req.body;
        if (isIndividual) {
            numberOfWorkers = 1;
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw (0, http_errors_1.default)(400, 'You need to upload 1 image');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product/secured/user-data', _id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        product = yield AgricultureLaborProduct_model_1.AgricultureLaborProduct.create({
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
            isIndividual,
            services,
            _id,
            numberOfWorkers,
            business: business._id,
        });
    }
    else {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    yield (0, formatImageUrl_1.formatProductImageUrls)(product);
    res.status(201).json({ message: 'Product created successfully', product });
}));
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.body;
    if (!Object.values(business_types_1.BusinessCategory).includes(category)) {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    let product;
    const userId = req.userId;
    const serviceProvider = yield serviceProvider_model_1.default.findById(userId);
    if (!serviceProvider) {
        throw (0, http_errors_1.default)(404, "Service provider not found");
    }
    if (serviceProvider.status !== provider_types_1.ServiceProviderStatus.VERIFIED) {
        throw (0, http_errors_1.default)(400, "Service provider is not verified");
    }
    const business = yield business_model_1.Business.findOne({ serviceProvider: serviceProvider._id });
    if (!business) {
        throw (0, http_errors_1.default)(404, "Business not found");
    }
    if (!business.category.includes(category)) {
        throw (0, http_errors_1.default)(400, "Category not found in business");
    }
    if (category === business_types_1.BusinessCategory.HARVESTORS) {
        const { hp, modelNo, type, id } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw (0, http_errors_1.default)(400, "Invalid id");
        }
        product = yield harvestorProduct_model_1.HarvestorProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        else if (product.verificationStatus == product_types_1.ProductStatus.REJECTED) {
            throw (0, http_errors_1.default)(400, "Product is rejected");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product._id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        product = yield harvestorProduct_model_1.HarvestorProduct.findByIdAndUpdate(product._id, {
            $set: {
                images: uploadedImages,
                hp,
                modelNo,
                verificationStatus: product.verificationStatus == product_types_1.ProductStatus.UNVERIFIED ? product_types_1.ProductStatus.UNVERIFIED : product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED,
                business: business._id,
                type: type
            }
        }, { new: true });
    }
    else if (category === business_types_1.BusinessCategory.EARTH_MOVERS) {
        const { modelNo, hp, type, id } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw (0, http_errors_1.default)(400, "Invalid id");
        }
        product = yield earthMoverProduct_model_1.EarthMoverProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        else if (product.verificationStatus == product_types_1.ProductStatus.REJECTED) {
            throw (0, http_errors_1.default)(400, "Product is rejected");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product._id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        product = yield earthMoverProduct_model_1.EarthMoverProduct.findByIdAndUpdate(product._id, {
            $set: {
                images: uploadedImages,
                modelNo,
                hp,
                verificationStatus: product.verificationStatus == product_types_1.ProductStatus.UNVERIFIED ? product_types_1.ProductStatus.UNVERIFIED : product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED,
                business: business._id,
                type: type
            }
        }, { new: true });
    }
    else if (category === business_types_1.BusinessCategory.IMPLEMENTS) {
        const { modelNo, hp, id } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw (0, http_errors_1.default)(400, "Invalid id");
        }
        product = yield ImplementProduct_model_1.ImplementProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        else if (product.verificationStatus == product_types_1.ProductStatus.REJECTED) {
            throw (0, http_errors_1.default)(400, "Product is rejected");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product._id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        product = yield ImplementProduct_model_1.ImplementProduct.findByIdAndUpdate(product._id, {
            $set: {
                images: uploadedImages,
                modelNo,
                hp,
                verificationStatus: product.verificationStatus == product_types_1.ProductStatus.UNVERIFIED ? product_types_1.ProductStatus.UNVERIFIED : product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED,
                business: business._id
            }
        }, { new: true });
    }
    else if (category === business_types_1.BusinessCategory.MACHINES) {
        const { modelNo, hp, id } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw (0, http_errors_1.default)(400, "Invalid id");
        }
        product = yield MachineProduct_model_1.MachineProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        else if (product.verificationStatus == product_types_1.ProductStatus.REJECTED) {
            throw (0, http_errors_1.default)(400, "Product is rejected");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product._id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        product = yield MachineProduct_model_1.MachineProduct.findByIdAndUpdate(product._id, {
            $set: {
                images: uploadedImages,
                modelNo,
                hp,
                verificationStatus: product.verificationStatus == product_types_1.ProductStatus.UNVERIFIED ? product_types_1.ProductStatus.UNVERIFIED : product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED,
                business: business._id,
            }
        }, { new: true });
    }
    else if (category === business_types_1.BusinessCategory.PADDY_TRANSPLANTORS) {
        const { modelNo, hp, id } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw (0, http_errors_1.default)(400, "Invalid id");
        }
        product = yield PaddyTransplantorProduct_model_1.PaddyTransplantorProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        else if (product.verificationStatus == product_types_1.ProductStatus.REJECTED) {
            throw (0, http_errors_1.default)(400, "Product is rejected");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product._id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        product = yield PaddyTransplantorProduct_model_1.PaddyTransplantorProduct.findByIdAndUpdate(product._id, {
            $set: {
                images: uploadedImages,
                modelNo,
                hp,
                verificationStatus: product.verificationStatus == product_types_1.ProductStatus.UNVERIFIED ? product_types_1.ProductStatus.UNVERIFIED : product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED,
                business: business._id,
            }
        }, { new: true });
    }
    else if (category === business_types_1.BusinessCategory.DRONES) {
        const { type, modelNo, id } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw (0, http_errors_1.default)(400, "Invalid id");
        }
        product = yield DroneProduct_model_1.DroneProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        else if (product.verificationStatus == product_types_1.ProductStatus.REJECTED) {
            throw (0, http_errors_1.default)(400, "Product is rejected");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        else if (req.files.length !== 5) {
            // 4 photos from 4 directions and 1 bill
            throw (0, http_errors_1.default)(400, 'You need to upload 5 images');
        }
        const images = req.files.map((file, index) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, index < 4 ? 'product/product-images' : 'product/secured/user-data', product._id.toString() + index); }));
        const uploadedImages = yield Promise.all(images);
        product = yield DroneProduct_model_1.DroneProduct.findByIdAndUpdate(product._id, {
            $set: {
                images: uploadedImages,
                type,
                modelNo,
                verificationStatus: product.verificationStatus == product_types_1.ProductStatus.UNVERIFIED ? product_types_1.ProductStatus.UNVERIFIED : product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED,
                business: business._id,
            }
        }, { new: true });
    }
    else if (category === business_types_1.BusinessCategory.MECHANICS) {
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers, id } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw (0, http_errors_1.default)(400, "Invalid id");
        }
        product = yield MechanicProduct_model_1.MechanicProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        else if (product.verificationStatus == product_types_1.ProductStatus.REJECTED) {
            throw (0, http_errors_1.default)(400, "Product is rejected");
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw (0, http_errors_1.default)(400, 'You need to upload 1 image');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product/secured/user-data', product._id.toString()); }));
        const uploadedImages = yield Promise.all(images);
        if (isIndividual) {
            numberOfWorkers = 1;
        }
        product = yield MechanicProduct_model_1.MechanicProduct.findByIdAndUpdate(product._id, {
            $set: {
                images: uploadedImages,
                eShramCardNumber,
                readyToTravelIn10Km,
                isIndividual,
                services,
                numberOfWorkers,
                verificationStatus: product.verificationStatus == product_types_1.ProductStatus.UNVERIFIED ? product_types_1.ProductStatus.UNVERIFIED : product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED,
                business: business._id,
            }
        }, { new: true });
    }
    else if (category === business_types_1.BusinessCategory.AGRICULTURE_LABOR) {
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers, id } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw (0, http_errors_1.default)(400, "Invalid id");
        }
        product = yield AgricultureLaborProduct_model_1.AgricultureLaborProduct.findById(id);
        if (!product) {
            throw (0, http_errors_1.default)(404, "Product not found");
        }
        else if (product.verificationStatus == product_types_1.ProductStatus.REJECTED) {
            throw (0, http_errors_1.default)(400, "Product is rejected");
        }
        if (isIndividual) {
            numberOfWorkers = 1;
        }
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Product  picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw (0, http_errors_1.default)(400, 'You need to upload 1 image');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product/secured/user-data', product._id.toString()); }));
        const uploadedImages = yield Promise.all(images);
        product = yield AgricultureLaborProduct_model_1.AgricultureLaborProduct.findByIdAndUpdate(product._id, {
            $set: {
                images: uploadedImages,
                eShramCardNumber,
                readyToTravelIn10Km,
                isIndividual,
                services,
                verificationStatus: product.verificationStatus == product_types_1.ProductStatus.UNVERIFIED ? product_types_1.ProductStatus.UNVERIFIED : product_types_1.ProductStatus.RE_VERIFICATION_REQUIRED,
                numberOfWorkers,
                business: business._id,
            }
        }, { new: true });
    }
    else {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    yield (0, formatImageUrl_1.formatProductImageUrls)(product);
    res.status(201).json({ message: 'Product created successfully', product });
}));
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
    if (category === business_types_1.BusinessCategory.HARVESTORS) {
        product = yield harvestorProduct_model_1.HarvestorProduct.findById(productId);
    }
    else if (category === business_types_1.BusinessCategory.EARTH_MOVERS) {
        product = yield earthMoverProduct_model_1.EarthMoverProduct.findById(productId);
    }
    else if (category === business_types_1.BusinessCategory.IMPLEMENTS) {
        product = yield ImplementProduct_model_1.ImplementProduct.findById(productId);
    }
    else if (category === business_types_1.BusinessCategory.MACHINES) {
        product = yield MachineProduct_model_1.MachineProduct.findById(productId);
    }
    else if (category === business_types_1.BusinessCategory.MECHANICS) {
        product = yield MechanicProduct_model_1.MechanicProduct.findById(productId);
    }
    else if (category === business_types_1.BusinessCategory.AGRICULTURE_LABOR) {
        product = yield AgricultureLaborProduct_model_1.AgricultureLaborProduct.findById(productId);
    }
    else if (category === business_types_1.BusinessCategory.PADDY_TRANSPLANTORS) {
        product = yield PaddyTransplantorProduct_model_1.PaddyTransplantorProduct.findById(productId);
    }
    else if (category === business_types_1.BusinessCategory.DRONES) {
        product = yield DroneProduct_model_1.DroneProduct.findById(productId);
    }
    else {
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    if (!product) {
        throw (0, http_errors_1.default)(404, 'Product not found');
    }
    else if (product.verificationStatus != product_types_1.ProductStatus.VERIFIED) {
        throw (0, http_errors_1.default)(400, 'Product is not verified');
    }
    if (product.ratings.find(r => r.userId.toString() == userId)) {
        throw (0, http_errors_1.default)(400, 'You have already rated this product');
    }
    product.avgRating = (product.avgRating * product.ratings.length + rating) / (product.ratings.length + 1);
    product.ratings.push({ userId: new mongoose_1.default.Types.ObjectId(userId), rating });
    yield product.save();
    res.status(200).json({ message: 'Product rated successfully', product });
}));
