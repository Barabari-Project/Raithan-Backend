import mongoose, { Schema } from "mongoose";
import { AgricultureLaborServiceType, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";
const AgricultureLaborProductSchema = new Schema({
    images: {
        type: [String],
        required: [true, "Images are required."],
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
            values: Object.values(ProductStatus),
            message: "Verification status must be one of the valid options.",
        },
        default: ProductStatus.UNVERIFIED,
    },
    services: {
        type: [String],
        enum: {
            values: Object.values(AgricultureLaborServiceType),
            message: "Services must be one of the valid types.",
        },
        default: [],
    },
    numberOfWorkers: {
        type: Number,
        required: [true, "Number of workers is required."],
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        required: [true, "Business reference is required."],
    },
}, { timestamps: true });
AgricultureLaborProductSchema.post('save', function (error, doc, next) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    }
    else if (error.name == 'MongooseError') {
        throw createHttpError(400, `${error.message}`);
    }
    else {
        next(error); // Pass any other errors to the next middleware
    }
});
export const AgricultureLaborProduct = mongoose.model('agricultureLaborProduct', AgricultureLaborProductSchema, 'agricultureLaborProduct');
