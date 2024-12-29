import mongoose, { Schema } from "mongoose";
import { AgricultureLaborServiceType, IAgricultureLaborProduct, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";

const AgricultureLaborProductSchema: Schema = new Schema<IAgricultureLaborProduct>({
    images: {
        type: [String],
        required: true,
    },
    eShramCardNumber: {
        type: String,
        required: true,
    },
    readyToTravelIn10Km: {
        type: Boolean,
        required: true,
    },
    isIndividual: {
        type: Boolean,
        required: true,
    },
    verificationStatus: {
        type: String,
        enum: Object.values(ProductStatus),
        default: ProductStatus.UNVERIFIED,
    },
    services: {
        type: [String],
        enum: Object.values(AgricultureLaborServiceType),
        default: [],
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

AgricultureLaborProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

export const AgricultureLaborProduct = mongoose.model<IAgricultureLaborProduct>('agricultureLaborProduct', AgricultureLaborProductSchema, 'agricultureLaborProduct');