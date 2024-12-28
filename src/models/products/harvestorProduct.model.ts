import mongoose, { Schema } from "mongoose";
import { IHarvestorProduct } from "../../types/product.types";
import createHttpError from "http-errors";

const HarvestorProductSchema: Schema = new Schema<IHarvestorProduct>({
    images: {
        type: [String],
        required: true,
    },
    hp: {
        type: String,
        required: true,
    },
    modelNo: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        required: true,
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        required: true,
    },
}, { timestamps: true });

HarvestorProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

export const HarvestorProduct = mongoose.model<IHarvestorProduct>('harvestorProduct', HarvestorProductSchema, 'harvestorProduct');