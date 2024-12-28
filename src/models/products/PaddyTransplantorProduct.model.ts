import mongoose, { Schema } from "mongoose";
import { IPaddyTransplantorProduct } from "../../types/product.types";
import createHttpError from "http-errors";

const PaddyTransplantorProductSchema: Schema = new Schema<IPaddyTransplantorProduct>({
    images: {
        type: [String],
        required: true,
    },
    hp: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    modelNo: {
        type: String,
        required: true,
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        required: true,
    },
}, { timestamps: true });

PaddyTransplantorProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

export const PaddyTransplantorProduct = mongoose.model<IPaddyTransplantorProduct>('paddyTransplantorProduct', PaddyTransplantorProductSchema, 'paddyTransplantorProduct');