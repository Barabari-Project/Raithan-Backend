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
exports.AgricultureLaborProduct = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const product_types_1 = require("../../types/product.types");
const http_errors_1 = __importDefault(require("http-errors"));
const Rating_model_1 = require("../Rating.model");
const AgricultureLaborProductSchema = new mongoose_1.Schema({
    images: {
        "e-shram-card": {
            type: String,
            required: [true, "Front view image is required."],
        }
    },
    eShramCardNumber: {
        type: String,
        required: [true, "eShram Card Number is required."],
    },
    readyToTravelIn10Km: {
        type: Boolean,
        required: [true, "Please specify if the person is ready to travel within 10 km."],
    },
    isIndividual: {
        type: Boolean,
        required: [true, "Please specify if this is an individual labor or a group."],
    },
    verificationStatus: {
        type: String,
        enum: {
            values: Object.values(product_types_1.ProductStatus),
            message: "Verification status must be one of the valid options.",
        },
        default: product_types_1.ProductStatus.UNVERIFIED,
    },
    services: {
        type: [String],
        validate: {
            validator: function (values) {
                return values.every((value) => Object.values(product_types_1.AgricultureLaborServiceType).includes(value));
            },
            message: "Each service must be one of the valid types.",
        },
        default: [],
    },
    numberOfWorkers: {
        type: Number,
        required: [true, "Number of workers is required."],
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
        default: [],
        select: false,
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
AgricultureLaborProductSchema.post('save', function (error, doc, next) {
    handleMongooseError(error, next);
});
AgricultureLaborProductSchema.post('findOneAndUpdate', function (error, doc, next) {
    handleMongooseError(error, next);
});
exports.AgricultureLaborProduct = mongoose_1.default.model('agricultureLaborProduct', AgricultureLaborProductSchema, 'agricultureLaborProduct');
