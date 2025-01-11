import mongoose, { Schema } from "mongoose";
import { IDroneProduct, ProductStatus } from "../../types/product.types";
import createHttpError from "http-errors";
import { RatingSchema } from "../Rating.model";

const DroneProductSchema: Schema = new Schema<IDroneProduct>({
    images: {
        type: [String],
        required: [true, "Images are required."],
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
        required: [true, "Drone type is required."],
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

DroneProductSchema.post('save', function (error: any, doc: any, next: Function) {
    handleMongooseError(error, next);
});
DroneProductSchema.post('findOneAndUpdate', function (error: any, doc: any, next: Function) {
    handleMongooseError(error, next);
});

export const DroneProduct = mongoose.model<IDroneProduct>('droneProduct', DroneProductSchema, 'droneProduct');