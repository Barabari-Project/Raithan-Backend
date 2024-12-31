import mongoose, { Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IServiceProvider, ServiceProviderStatus } from '../types/provider.types';
import createHttpError from 'http-errors';
import { formateProviderImage } from '../utils/formatImageUrl';

const serviceProviderSchema = new Schema<IServiceProvider>({
    mobileNumber: {
        type: String,
        required: [true,'Mobile number is required'],
        unique: [true,'Mobile number is already exists']
    },
    email: {
        type: String,
        unique: [true, 'Email is already exists'],
        sparse: true,
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
    profilePicturePath: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(ServiceProviderStatus),
        default: ServiceProviderStatus.PENDING,
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
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
    } else if (error.name == 'MongooseError') {
        throw createHttpError(400, `${error.message}`);
    } else {
        next(error); // Pass any other errors to the next middleware
    }
});

// Create and export the ServiceProvider model
const ServiceProvider = mongoose.model<IServiceProvider>('serviceProvider', serviceProviderSchema, 'serviceProvider');

export default ServiceProvider;
