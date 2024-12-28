import mongoose, { Schema } from 'mongoose';
import { BusinessCategory, IBusiness } from '../types/business.types';
import createHttpError from 'http-errors';

const BusinessSchema: Schema = new Schema<IBusiness>(
    {
        businessName: {
            type: String,
            required: true,
            trim: true,
        },
        businessContactNo: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => /^(\+91|91|0)?[6-9]\d{9}$/.test(v),
                message: (props: any) => `${props.value} is not a valid contact number!`,
            },
        },
        businessEmail: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
                message: (props: any) => `${props.value} is not a valid email!`,
            },
        },
        pincode: {
            type: String,
            required: true,
            validate: {
                validator: (v: string) => /^\d{6}$/.test(v),
                message: (props: any) => `${props.value} is not a valid pincode!`,
            },
        },
        blockNumber: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        area: {
            type: String,
            required: true,
        },
        landmark: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        serviceProvider: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'serviceProvider',
            required: true,
        },
        workingDays: {
            type: Map,
            of: Boolean,
            required: true,
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
            type: new Schema(
                {
                    start: {
                        type: String,
                        required: true,
                        validate: {
                            validator: (v: string) => /^([0]?[0-9]|1[0-2]):[0-5][0-9] [ap]m$/.test(v),
                            message: (props: any) => `${props.value} is not a valid time!`,
                        },
                    },
                    end: {
                        type: String,
                        required: true,
                        validate: {
                            validator: (v: string) => /^([0]?[0-9]|1[0-2]):[0-5][0-9] [ap]m$/.test(v),
                            message: (props: any) => `${props.value} is not a valid time!`,
                        },
                    },
                },
                { _id: false }
            ),
            required: true,
        },
        category: {
            type: [String],
            default: [],
            enum: Object.values(BusinessCategory),
        },
    },
    { timestamps: true }
);

BusinessSchema.post('save', function (error: any, doc: any, next: Function) {
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw createHttpError(400, firstError.message);
    } else {
        next(error);
    }
});

// Export the model
export const Business = mongoose.model<IBusiness>('business', BusinessSchema, 'business');