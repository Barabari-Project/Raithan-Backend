import mongoose, { Schema } from 'mongoose';
import { BusinessCategory } from '../types/business.types';
import createHttpError from 'http-errors';
import { logger } from '..';
const BusinessSchema = new Schema({
    businessName: {
        type: String,
        required: [true, "Business Name is required"],
        trim: true,
    },
    businessContactNo: {
        type: String,
        required: [true, "Business Contact No is required"],
        validate: {
            validator: (v) => /^(\+91|91|0)?[6-9]\d{9}$/.test(v),
            message: (props) => `${props.value} is not a valid contact number!`,
        },
    },
    businessEmail: {
        type: String,
        required: [true, "Business Email Address is required"],
        unique: [true, "email address is already exists"],
        trim: true,
        lowercase: true,
        validate: {
            validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: (props) => `${props.value} is not a valid email!`,
        },
    },
    pincode: {
        type: String,
        required: [true, "Pincode is required"],
        validate: {
            validator: (v) => /^\d{6}$/.test(v),
            message: (props) => `${props.value} is not a valid pincode!`,
        },
    },
    blockNumber: {
        type: String,
        required: [true, "block Number is required"],
    },
    street: {
        type: String,
        required: [true, "Street is required"],
    },
    area: {
        type: String,
        required: [true, "area is required"],
    },
    landmark: {
        type: String,
    },
    city: {
        type: String,
        required: [true, "city is required"],
    },
    state: {
        type: String,
        required: [true, "state is required"],
    },
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceProvider',
        required: [true, 'serviceProvider is required'],
    },
    workingDays: {
        type: Map,
        of: Boolean,
        required: [true, "workingDays are required"],
        default: {
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
            Sunday: false,
        },
    },
    workingTime: {
        type: new Schema({
            start: {
                type: String,
                required: true,
                validate: {
                    validator: (v) => /^([0]?[0-9]|1[0-2]):[0-5][0-9] [ap]m$/.test(v),
                    message: (props) => `${props.value} is not a valid time!`,
                },
            },
            end: {
                type: String,
                required: true,
                validate: {
                    validator: (v) => /^([0]?[0-9]|1[0-2]):[0-5][0-9] [ap]m$/.test(v),
                    message: (props) => `${props.value} is not a valid time!`,
                },
            },
        }, { _id: false }),
        required: [true, "working time is required"],
    },
    category: {
        type: [String],
        default: [],
        enum: Object.values(BusinessCategory),
    },
}, { timestamps: true });
BusinessSchema.post('save', function (error, doc, next) {
    logger.debug(error.name);
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
// Export the model
export const Business = mongoose.model('business', BusinessSchema, 'business');
