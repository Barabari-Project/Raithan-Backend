import { Schema } from "mongoose";
import { IRating } from "../types/product.types";

export const RatingSchema = new Schema<IRating>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'serviceSeeker',
        required: [true,'Seeker Id must be provided.']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required.'],
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5']
    },
});