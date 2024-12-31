import mongoose, { Document } from "mongoose";

export interface ICallHistory extends Document {
    _id: mongoose.Types.ObjectId;
    serviceSeekerMobileNumber: string;
    serviceProviderMobileNumber: string;
    serviceSeeker: mongoose.Types.ObjectId;
    serviceProvider: mongoose.Types.ObjectId;
}