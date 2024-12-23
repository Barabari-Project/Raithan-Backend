import mongoose, { Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IServiceProvider, ServiceProviderStatus } from '../types/provider.types';
import createHttpError from 'http-errors';

const serviceProviderSchema = new Schema<IServiceProvider>({
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10}$/,
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows partial index for unique emails
    },
    password: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    profilePictureUrl: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(ServiceProviderStatus),
        default: ServiceProviderStatus.PENDING,
    },
    businessDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'businessDetails',
        required: [true, 'Business details are required'],
    },
}, {
    timestamps: true,
});

// Pre-save middleware to hash the password
serviceProviderSchema.pre<IServiceProvider>('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as CallbackError);
    }
});

serviceProviderSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

// Create and export the ServiceProvider model
const ServiceProvider = mongoose.model<IServiceProvider>('serviceProvider', serviceProviderSchema, 'serviceProvider');

export default ServiceProvider;
