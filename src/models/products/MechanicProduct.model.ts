import mongoose, { Schema } from "mongoose";
import { IMechanicProduct, MechanicServiceType, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";

const MechanicProductSchema: Schema = new Schema<IMechanicProduct>({
    images: {
        type: [String],
        required: true,
    },
    services: {
        type: [String],
        enum: Object.values(MechanicServiceType),
        default: [],
        required: true,
    },
    eShramCardNumber: {
        type: String,
        required: true,
    },
    verificationStatus: {
        type: String,
        enum: Object.values(ProductStatus),
        default: ProductStatus.UNVERIFIED,
    },
    readyToTravelIn10Km: {
        type: Boolean,
        required: true,
    },
    isIndividual: {
        type: Boolean,
        required: true,
    },
    numberOfWorkers: {
        type: Number,
        required: true,
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        required: true,
    },
}, { timestamps: true });

MechanicProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

export const MechanicProduct = mongoose.model<IMechanicProduct>('mechanicProduct', MechanicProductSchema, 'mechanicProduct');