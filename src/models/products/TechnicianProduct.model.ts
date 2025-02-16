import createHttpError from "http-errors";
import mongoose, { Schema } from "mongoose";
import { IMechanicProduct, ProductStatus, TechnicianServiceType } from "../../types/product.types";
import { RatingSchema } from "../Rating.model";

const TechnicianProductSchema: Schema = new Schema<IMechanicProduct>({
    images: {
        "e-shram-card": {
            type: String,
            required: [true, "Front view image is required."],
        }
    },
    services: {
        type: [String],
        validate: {
            validator: function (values) {
                return values.every((value: TechnicianServiceType) => Object.values(TechnicianServiceType).includes(value));
            },
            message: "Each service must be one of the valid types.",
        },
        default: [],
    },
    eShramCardNumber: {
        type: String,
        required: [true, "eShram Card Number is required."],
    },
    verificationStatus: {
        type: String,
        enum: {
            values: Object.values(ProductStatus),
            message: "Verification status must be one of the valid options.",
        },
        default: ProductStatus.UNVERIFIED,
    },
    readyToTravelIn10Km: {
        type: Boolean,
        required: [true, "Please specify if ready to travel within 10 km."],
    },
    isIndividual: {
        type: Boolean,
        required: [true, "Please specify if this is an individual mechanic or a group."],
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
        default: [],
        select: false,
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

TechnicianProductSchema.post('save', function (error: any, doc: any, next: Function) {
    handleMongooseError(error, next);
});
TechnicianProductSchema.post('findOneAndUpdate', function (error: any, doc: any, next: Function) {
    handleMongooseError(error, next);
});

export const TechnicianProduct = mongoose.model<IMechanicProduct>('technicianProduct', TechnicianProductSchema, 'technicianProduct');