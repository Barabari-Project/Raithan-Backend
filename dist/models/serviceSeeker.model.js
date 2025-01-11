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
const mongoose_1 = __importStar(require("mongoose"));
const seeker_types_1 = require("../types/seeker.types");
const http_errors_1 = __importDefault(require("http-errors"));
const serviceSeekerSchema = new mongoose_1.Schema({
    mobileNumber: {
        type: String,
        required: [true, 'Mobile Number is required.'],
        unique: [true, 'Mobile Number is already Exists.']
    },
    status: {
        type: String,
        enum: {
            values: Object.values(seeker_types_1.ServiceSeekerStatus),
            message: "Status must be one of the valid options.",
        },
        default: seeker_types_1.ServiceSeekerStatus.PENDING,
    }
}, {
    timestamps: true,
});
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
serviceSeekerSchema.post('save', function (error, doc, next) {
    handleMongooseError(error, next);
});
serviceSeekerSchema.post('findOneAndUpdate', function (error, doc, next) {
    handleMongooseError(error, next);
});
// Create and export the ServiceProvider model
const ServiceSeeker = mongoose_1.default.model('serviceSeeker', serviceSeekerSchema, 'serviceSeeker');
exports.default = ServiceSeeker;
