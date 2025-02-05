import mongoose, { Document } from "mongoose";

export enum BusinessCategory {
    MECHANICS = 'Mechanics',
    PADDY_TRANSPLANTORS = 'Paddy Transplantors',
    DRONES = 'Drones',
    HARVESTORS = 'Harvestors',
    AGRICULTURE_LABOR = 'Agriculture Labor',
    EARTH_MOVERS = 'Earth Movers',
    IMPLEMENTS = 'Implements',
    MACHINES = 'Machines',
    TECHNICIAN = 'Technician'
}

export interface IBusiness extends Document {
    _id: mongoose.Types.ObjectId;
    businessName: string;
    pincode: string;
    mobileNumber: string;
    blockNumber: string;
    street: string;
    area: string;
    landmark?: string;
    city: string;
    state: string;
    serviceProvider: mongoose.Types.ObjectId;
    workingDays: { [day: string]: boolean };
    businessType: string;
    workingTime: { start: string; end: string };
    category: BusinessCategory[];
    location?: {
        lat: number;
        lng: number;
    };
}

export interface IOTP extends Document {
    phone: string;
    otp: string;
    expiresAt: Date;
    isVerified: boolean;
}