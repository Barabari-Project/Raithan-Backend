import mongoose, { Schema } from 'mongoose';
import createHttpError from 'http-errors';
const serviceSeekerSchema = new Schema({
    mobileNumber: {
        type: String,
        required: [true, 'Mobile Number is required.'],
        unique: [true, 'Mobile Number is already Exists.']
    },
}, {
    timestamps: true,
});
serviceSeekerSchema.post('save', function (error, doc, next) {
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
const ServiceSeeker = mongoose.model('serviceSeeker', serviceSeekerSchema, 'serviceSeeker');
export default ServiceSeeker;
