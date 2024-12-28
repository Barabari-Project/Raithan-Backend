import mongoose, { Schema } from "mongoose";
import { IEarthMoverProduct, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";

const EarthMoverProductSchema: Schema = new Schema<IEarthMoverProduct>({
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
    verificationStatus: {
        type: String,
        enum: Object.values(ProductStatus),
        default: ProductStatus.UNVERIFIED,
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

EarthMoverProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

export const EarthMoverProduct = mongoose.model<IEarthMoverProduct>('earthMoverProduct', EarthMoverProductSchema, 'earthMoverProduct');