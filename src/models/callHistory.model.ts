import mongoose, { Schema } from 'mongoose';
import createHttpError from 'http-errors';
import { ICallHistory } from '../types/common.types';

const callHistorySchema = new Schema<ICallHistory>({
    serviceSeekerMobileNumber:{
        type: String,
        required: [true,'Service Seeker Mobile Number is required'],
    },
    serviceProviderMobileNumber:{
        type: String,
        required: [true, 'Service Provider Mobile Number is required'],
    },
    serviceSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceSeeker',
        required: [true,'Service Seeker id is required'],
    },
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceProvider',
        required: [true,'Service Provider id is required'],
    }
}, {
    timestamps: true,
});

callHistorySchema.post('save', function (error: any, doc: any, next: Function) {
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
const CallHistory = mongoose.model<ICallHistory>('callHistory', callHistorySchema, 'callHistory');

export default CallHistory;
