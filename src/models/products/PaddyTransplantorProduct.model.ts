import mongoose, { Schema } from "mongoose";
import { IPaddyTransplantorProduct, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";

const PaddyTransplantorProductSchema: Schema = new Schema<IPaddyTransplantorProduct>({
    images: {
        type: [String],
        required: [true, "Images are required."],
    },
    hp: {
        type: String,
        required: [true, "Horsepower (hp) is required."],
    },
    verificationStatus: {
        type: String,
        enum: {
            values: Object.values(ProductStatus),
            message: "Verification status must be one of the valid options.",
        },
        default: ProductStatus.UNVERIFIED,
    },
    modelNo: {
        type: String,
        required: [true, "Model number is required."],
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        required: [true, "Business reference is required."],
    },
}, { timestamps: true });

PaddyTransplantorProductSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else if (error.name == 'MongooseError') {
        throw createHttpError(400, `${error.message}`);
    } else {
        next(error); // Pass any other errors to the next middleware
    }
});

export const PaddyTransplantorProduct = mongoose.model<IPaddyTransplantorProduct>('paddyTransplantorProduct', PaddyTransplantorProductSchema, 'paddyTransplantorProduct');