"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.RatingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'serviceSeeker',
        required: [true, 'Seeker Id must be provided.']
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required.'],
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5']
    },
});
