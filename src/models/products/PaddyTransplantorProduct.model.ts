import mongoose, { Schema } from "mongoose";
import { IPaddyTransplantorProduct, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";
import { RatingSchema } from "../Rating.model";

const PaddyTransplantorProductSchema: Schema = new Schema<IPaddyTransplantorProduct>({
    images: {
        "front-view": {
            type: String,
            required: [true, "Front view image is required."],
        },
        "back-view": {
            type: String,
            required: [true, "Back view image is required."],
        },
        "left-view": {
            type: String,
            required: [true, "Left view image is required."],
        },
        "right-view": {
            type: String,
            required: [true, "Right view image is required."],
        },
        "driving-license": {
            type: String,
            required: [true, "Driving license image is required."],
        },
        "rc-book": {
            type: String,
            required: [true, "RC book image is required."],
        },
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
    avgRating: {
        type: Number,
        default: 0
    },
    ratings: {
        type: [RatingSchema],
        default: []
    },
}, { timestamps: true });

const handleMongooseError = (error: any, next: Function) => {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else if (error.name == 'MongooseError') {
        throw createHttpError(400, `${error.message}`);
    } else {
        next(error); // Pass any other errors to the next middleware
    }
};

PaddyTransplantorProductSchema.post('save', function (error: any, doc: any, next: Function) {
    handleMongooseError(error, next);
});
PaddyTransplantorProductSchema.post('findOneAndUpdate', function (error: any, doc: any, next: Function) {
    handleMongooseError(error, next);
});

export const PaddyTransplantorProduct = mongoose.model<IPaddyTransplantorProduct>('paddyTransplantorProduct', PaddyTransplantorProductSchema, 'paddyTransplantorProduct');