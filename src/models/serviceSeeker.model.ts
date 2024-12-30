import mongoose, { Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IServiceSeeker } from '../types/seeker.types';
import createHttpError from 'http-errors';

const serviceSeekerSchema = new Schema<IServiceSeeker>({
    mobileNumber: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true,
});

serviceSeekerSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else if (error.name == 'MongooseError') {
        throw createHttpError(400, `${error.message}`);
    } else {
        next(error); // Pass any other errors to the next middleware
    }
});

// Create and export the ServiceProvider model
const ServiceSeeker = mongoose.model<IServiceSeeker>('serviceSeeker', serviceSeekerSchema, 'serviceSeeker');

export default ServiceSeeker;
