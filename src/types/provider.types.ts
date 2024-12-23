import { Document } from 'mongoose';

export interface IBusinessDetails extends Document {
    businessName: string;
    businessAddress: string;
}

export interface IServiceProvider extends Document {
    _id: string;
    mobileNumber: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
    businessDetails?: IBusinessDetails['_id'];  // Reference to the businessDetails model
    status: ServiceProviderStatus;
}

export enum ServiceProviderStatus {
    PENDING = "pending",
    OTP_VERIFIED = "otp_verified",
    EMAIL_VERIFIED = "email_verified",
    COMPLETED = "completed",
}
