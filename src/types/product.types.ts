import mongoose, { Document } from "mongoose";

export interface IHarvestorProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
    images: string[];
    hp: string;
    modelNo: string;
    type: string;
    verificationStatus: ProductStatus;
}

export interface IEarthMoverProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
    images: string[];
    hp: string;
    modelNo: string;
    type: string;
    verificationStatus: ProductStatus;
}

export enum ProductStatus {
    VERIFIED = 'Verified',
    UNVERIFIED = 'Unverified',
    REJECTED = 'Rejected',
}

export interface IImplementProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
    images: string[];
    hp: string;
    modelNo: string;
    verificationStatus: ProductStatus;
}

export interface IMachineProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
    images: string[];
    hp: string;
    modelNo: string;
    verificationStatus: ProductStatus;
}

export interface IPaddyTransplantorProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
    images: string[];
    hp: string;
    modelNo: string;
    verificationStatus: ProductStatus;
}

export interface IDroneProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
    images: string[];
    modelNo: string;
    type: string;
    verificationStatus: ProductStatus;
}

export interface IMechanicProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
    images: string[];
    eShramCardNumber: string;
    readyToTravelIn10Km: boolean;
    isIndividual: boolean;
    services: MechanicServiceType[];
    numberOfWorkers: number;
    verificationStatus: ProductStatus;
}

export enum MechanicServiceType {
    ELECTRIC_WATER_PUMP = 'Electric Water Pump',
    DIESEL_WATER_PUMP = 'Diesel Water Pump',
    SOLAR_WATER_PUMP = 'Solar Water Pump',
    TRACTOR_REPAIR = 'Tractor Repair',
}

export interface IAgricultureLaborProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
    images: string[];
    eShramCardNumber: string;
    readyToTravelIn10Km: boolean;
    isIndividual: boolean;
    services: AgricultureLaborServiceType[];
    numberOfWorkers: number;
    verificationStatus: ProductStatus;
}

export enum AgricultureLaborServiceType {
    SOWING_DRYLANDS = 'Sowing Drylands',
    TRANSPLANTATION_WETLANDS = 'Transplantation Wetlands',

    WEEDING_DRYLANDS = 'Weeding Drylands',
    WEEDING_WETLANDS = 'Weeding Wetlands',

    FERTILIZATION_DRYLANDS = 'Fertilization Drylands',
    FERTILIZATION_WETLANDS = 'Fertilization Wetlands',

    SPRAYING_DRYLANDS_WITH_HAND_PUMP = 'Spraying Drylands with Hand pump',
    SPRAYING_DRYLANDS_WITH_BATTERY_PUMP = 'Spraying Drylands with Battery pump',
    SPRAYING_DRYLANDS_WITH_PETROL_PUMP = 'Spraying Drylands with Petrol pump',
    SPRAYING_WETLANDS_WITH_HAND_PUMP = 'Spraying Wetlands with Hand pump',
    SPRAYING_WETLANDS_WITH_BATTERY_PUMP = 'Spraying Wetlands with Battery pump',
    SPRAYING_WETLANDS_WITH_PETROL_PUMP = 'Spraying Wetlands with Petrol pump',

    HARVESTING_COMMERCIAL_CROPS = 'Harvesting Commercial Crops',
    HARVESTING_FRUITS_CROPS = 'Harvesting Fruits Crops',
    HARVESTING_VEGETABLES_CROPS = 'Harvesting Vegetables Crops',
    HARVESTING_CROPS = 'Harvesting Crops',
}

