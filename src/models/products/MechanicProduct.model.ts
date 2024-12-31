import mongoose, { Schema } from "mongoose";
import { IMechanicProduct, MechanicServiceType, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";

const MechanicProductSchema: Schema = new Schema<IMechanicProduct>({
    images: {
        type: [String],
        required: [true, "Images are required."],
    },
    services: {
        type: [String],
        enum: {
            values: Object.values(MechanicServiceType),
            message: "Services must be one of the valid types.",
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
}, { timestamps: true });

MechanicProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else if (error.name == 'MongooseError') {
        throw createHttpError(400, `${error.message}`);
    } else {
        next(error); // Pass any other errors to the next middleware
    }
});

export const MechanicProduct = mongoose.model<IMechanicProduct>('mechanicProduct', MechanicProductSchema, 'mechanicProduct');