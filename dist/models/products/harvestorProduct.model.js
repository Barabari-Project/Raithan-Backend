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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestorProduct = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const product_types_1 = require("../../types/product.types");
const http_errors_1 = __importDefault(require("http-errors"));
const Rating_model_1 = require("../Rating.model");
const HarvestorProductSchema = new mongoose_1.Schema({
    images: {
        "front-view": {
            type: String,
            required: [true, "Front view image is required."],
        },
        "back-view": {
            type: String,
            required: [true, "Back view image is required."],
        },
        "left-view": {
            type: String,
            required: [true, "Left view image is required."],
        },
        "right-view": {
            type: String,
            required: [true, "Right view image is required."],
        },
        "driving-license": {
            type: String,
            required: [true, "Driving license image is required."],
        },
        "rc-book": {
            type: String,
            required: [true, "RC book image is required."],
        },
    },
    hp: {
        type: String,
        required: [true, "Horsepower (hp) is required."],
    },
    modelNo: {
        type: String,
        required: [true, "Model number is required."],
    },
    verificationStatus: {
        type: String,
        enum: {
            values: Object.values(product_types_1.ProductStatus),
            message: "Verification status must be one of the valid options.",
        },
        default: product_types_1.ProductStatus.UNVERIFIED,
    },
    type: {
        type: String,
        required: [true, "Harvestor type is required."],
    },
    business: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'business',
        required: [true, "Business reference is required."],
    },
    avgRating: {
        type: Number,
        default: 0
    },
    ratings: {
        type: [Rating_model_1.RatingSchema],
        default: []
    },
}, { timestamps: true });
const handleMongooseError = (error, next) => {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw (0, http_errors_1.default)(400, firstError.message);
    }
    else if (error.name == 'MongooseError') {
        throw (0, http_errors_1.default)(400, `${error.message}`);
    }
    else {
        next(error); // Pass any other errors to the next middleware
    }
};
HarvestorProductSchema.post('save', function (error, doc, next) {
    handleMongooseError(error, next);
});
HarvestorProductSchema.post('findOneAndUpdate', function (error, doc, next) {
    handleMongooseError(error, next);
});
exports.HarvestorProduct = mongoose_1.default.model('harvestorProduct', HarvestorProductSchema, 'harvestorProduct');
