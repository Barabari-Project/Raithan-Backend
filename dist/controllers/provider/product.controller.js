"use strict";
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
exports.createProduct = void 0;
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
    if (category === business_types_1.BusinessCategory.HARVESTORS) {
        const { hp, modelNo, type } = req.body;
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Profile picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product-images'); }));
        const uploadedImages = yield Promise.all(images);
        product = yield harvestorProduct_model_1.HarvestorProduct.create({
            images: uploadedImages,
            hp,
            modelNo,
            business: business._id,
            type: type
        });
    }
    else if (category === business_types_1.BusinessCategory.EARTH_MOVERS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Profile picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product-images'); }));
        const uploadedImages = yield Promise.all(images);
        const { modelNo, hp, type } = req.body;
        product = yield earthMoverProduct_model_1.EarthMoverProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            business: business._id,
            type: type
        });
    }
    else if (category === business_types_1.BusinessCategory.IMPLEMENTS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Profile picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product-images'); }));
        const uploadedImages = yield Promise.all(images);
        const { modelNo, hp, type } = req.body;
        product = yield ImplementProduct_model_1.ImplementProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            business: business._id
        });
    }
    else if (category === business_types_1.BusinessCategory.MACHINES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Profile picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product-images'); }));
        const uploadedImages = yield Promise.all(images);
        const { modelNo, hp, type } = req.body;
        product = yield MachineProduct_model_1.MachineProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            business: business._id,
        });
    }
    else if (category === business_types_1.BusinessCategory.PADDY_TRANSPLANTORS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Profile picture is required');
        }
        else if (req.files.length !== 6) {
            // 4 photos from 4 directions, driving license and rc book
            throw (0, http_errors_1.default)(400, 'You need to upload 6 images');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product-images'); }));
        const uploadedImages = yield Promise.all(images);
        const { modelNo, hp } = req.body;
        product = yield PaddyTransplantorProduct_model_1.PaddyTransplantorProduct.create({
            images: uploadedImages,
            modelNo,
            hp,
            business: business._id,
        });
    }
    else if (category === business_types_1.BusinessCategory.DRONES) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Profile picture is required');
        }
        else if (req.files.length !== 5) {
            // 4 photos from 4 directions and 1 bill
            throw (0, http_errors_1.default)(400, 'You need to upload 5 images');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product-images'); }));
        const uploadedImages = yield Promise.all(images);
        const { type, modelNo } = req.body;
        product = yield DroneProduct_model_1.DroneProduct.create({
            images: uploadedImages,
            type,
            modelNo,
            business: business._id,
        });
    }
    else if (category === business_types_1.BusinessCategory.MECHANICS) {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            throw (0, http_errors_1.default)(400, 'Profile picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw (0, http_errors_1.default)(400, 'You need to upload 1 image');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product-images'); }));
        const uploadedImages = yield Promise.all(images);
        let { eShramCardNumber, readyToTravelIn10Km, isIndividual, services, numberOfWorkers } = req.body;
        if (isIndividual) {
            numberOfWorkers = 1;
        }
        product = yield MechanicProduct_model_1.MechanicProduct.create({
            images: uploadedImages,
            eShramCardNumber,
            readyToTravelIn10Km,
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
            throw (0, http_errors_1.default)(400, 'Profile picture is required');
        }
        // eShram card 
        if (req.files.length !== 1) {
            throw (0, http_errors_1.default)(400, 'You need to upload 1 image');
        }
        const images = req.files.map((file) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, s3Upload_1.uploadFileToS3)(file, 'product-images'); }));
        const uploadedImages = yield Promise.all(images);
        product = yield AgricultureLaborProduct_model_1.AgricultureLaborProduct.create({
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
        throw (0, http_errors_1.default)(400, "Invalid category");
    }
    res.status(201).json({ message: 'Product created successfully', product });
}));
