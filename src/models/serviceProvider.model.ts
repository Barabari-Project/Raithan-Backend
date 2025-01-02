import createHttpError from 'http-errors';
import mongoose, { Schema } from 'mongoose';
import { Gender, IServiceProvider, ServiceProviderStatus } from '../types/provider.types';

const serviceProviderSchema = new Schema<IServiceProvider>({
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: [true, 'Mobile number is already exists']
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
        enum: {
            values: Object.values(ServiceProviderStatus),
            message: "Status must be one of the valid options.",
        },
        default: ServiceProviderStatus.PENDING,
    },
    yearOfBirth: {
        type: Number
    },
    gender: {
        type: String,
        enum: {
            values: Object.values(Gender),
            message: "Gender must be one of the valid options.",
        }
    },
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business',
    },
}, {
    timestamps: true,
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
