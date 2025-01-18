import mongoose, { Schema } from "mongoose";
import { AgricultureLaborServiceType, IAgricultureLaborProduct, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";
import { RatingSchema } from "../Rating.model";

const AgricultureLaborProductSchema: Schema = new Schema<IAgricultureLaborProduct>({
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
    avgRating: {
        type: Number,
        default: 0
    },
    ratings: {
        type: [RatingSchema],
        default: []
    },
}, { timestamps: true });


const handleMongooseError = (error: any, next: Function) => {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else if (error.name == 'MongooseError') {
        throw createHttpError(400, `${error.message}`);
    } else {
        next(error); // Pass any other errors to the next middleware
    }
};

AgricultureLaborProductSchema.post('save', function (error: any, doc: any, next: Function) {
    handleMongooseError(error, next);
});
AgricultureLaborProductSchema.post('findOneAndUpdate', function (error: any, doc: any, next: Function) {
    handleMongooseError(error, next);
});

export const AgricultureLaborProduct = mongoose.model<IAgricultureLaborProduct>('agricultureLaborProduct', AgricultureLaborProductSchema, 'agricultureLaborProduct');