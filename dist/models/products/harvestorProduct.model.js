import mongoose, { Schema } from "mongoose";
import { ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";
const HarvestorProductSchema = new Schema({
    images: {
        type: [String],
        required: [true, "Images are required."],
    },
    hp: {
        type: String,
        required: [true, "Horsepower (hp) is required."],
    },
    modelNo: {
        type: String,
        required: [true, "Model number is required."],
    },
    verificationStatus: {
        type: String,
        enum: {
            values: Object.values(ProductStatus),
            message: "Verification status must be one of the valid options.",
        },
        default: ProductStatus.UNVERIFIED,
    },
    type: {
        type: String,
        required: [true, "Harvestor type is required."],
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
        required: [true, "Business reference is required."],
    },
}, { timestamps: true });
HarvestorProductSchema.post('save', function (error, doc, next) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    }
    else if (error.name == 'MongooseError') {
        throw createHttpError(400, `${error.message}`);
    }
    else {
        next(error); // Pass any other errors to the next middleware
    }
});
export const HarvestorProduct = mongoose.model('harvestorProduct', HarvestorProductSchema, 'harvestorProduct');
