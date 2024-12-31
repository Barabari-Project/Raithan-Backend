import mongoose, { Schema } from 'mongoose';
import createHttpError from 'http-errors';
const callHistorySchema = new Schema({
    serviceSeekerMobileNumber: {
        type: String,
        required: [true, 'Service Seeker Mobile Number is required'],
    },
    serviceProviderMobileNumber: {
        type: String,
        required: [true, 'Service Provider Mobile Number is required'],
    },
    serviceSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceSeeker',
        required: [true, 'Service Seeker id is required'],
    },
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceProvider',
        required: [true, 'Service Provider id is required'],
    }
}, {
    timestamps: true,
});
callHistorySchema.post('save', function (error, doc, next) {
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
// Create and export the ServiceProvider model
const CallHistory = mongoose.model('callHistory', callHistorySchema, 'callHistory');
export default CallHistory;
