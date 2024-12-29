import mongoose, { Schema } from "mongoose";
import { IMachineProduct, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";

const MachineProductSchema: Schema = new Schema<IMachineProduct>({
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
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        required: true,
    },
}, { timestamps: true });

MachineProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

export const MachineProduct = mongoose.model<IMachineProduct>('machineProduct', MachineProductSchema, 'machineProduct');