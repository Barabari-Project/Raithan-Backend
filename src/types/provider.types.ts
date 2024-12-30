import { Document } from 'mongoose';
import { IBusiness } from './business.types';

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
    profilePicturePath?: string;
    business?: IBusiness['_id'];  // Reference to the businessDetails model
    status: ServiceProviderStatus;
}

export enum ServiceProviderStatus {
    PENDING = "pending",
    OTP_VERIFIED = "otp_verified",
    EMAIL_VERIFIED = "email_verified",
    BUSINESS_DETAILS_REMAINING = "business_details_remaining",
    COMPLETED = "completed",
    VERIFIED = "verified",
    REJECTED = "rejected",
}
