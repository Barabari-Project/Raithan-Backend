import mongoose, { Schema } from "mongoose";
import { IImplementProduct } from "../../types/product.types";
import createHttpError from "http-errors";

const ImplementProductSchema: Schema = new Schema<IImplementProduct>({
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
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        required: true,
    },
}, { timestamps: true });

ImplementProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

export const ImplementProduct = mongoose.model<IImplementProduct>('implementProduct', ImplementProductSchema, 'implementProduct');