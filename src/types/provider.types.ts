import { Document } from 'mongoose';
import { IBusiness } from './business.types';

export interface IBusinessDetails extends Document {
    businessName: string;
    businessAddress: string;
}

export interface IServiceProvider extends Document {
    _id: string;
    mobileNumber: string;
    firstName?: string;
    lastName?: string;
    yearOfBirth?: number;
    gender?: Gender;
    profilePicturePath?: string;
    business?: IBusiness['_id'];  // Reference to the businessDetails model
    status: ServiceProviderStatus;
}

export enum ServiceProviderStatus {
    PENDING = "pending",
    OTP_VERIFIED = "otp_verified",
    BUSINESS_DETAILS_REMAINING = "business_details_remaining",
    VERIFICATION_REQUIRED = "verification_required",
    VERIFIED = "verified",
    REJECTED = "rejected",
    MODIFICATION_REQUIRED = 'modification_required',
    RE_VERIFICATION_REQUIRED = 're_verification_required',
    BLOCKED = 'blocked'
}

export enum Gender {
    MALE = "Male",
    FEMALE = "Female",
    OTHER = "Other"
}