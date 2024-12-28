import mongoose, { Schema } from "mongoose";
import { IDroneProduct } from "../../types/product.types";
import createHttpError from "http-errors";

const DroneProductSchema: Schema = new Schema<IDroneProduct>({
    images: {
        type: [String],
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

DroneProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

export const DroneProduct = mongoose.model<IDroneProduct>('droneProduct', DroneProductSchema, 'droneProduct');