import mongoose, { Document } from "mongoose";
import { BusinessCategory, IBusiness } from "./business.types";
import { HarvestorProduct } from "../models/products/harvestorProduct.model";
import { ImplementProduct } from "../models/products/ImplementProduct.model";
import { MechanicProduct } from "../models/products/MechanicProduct.model";
import { MachineProduct } from "../models/products/MachineProduct.model";
import { PaddyTransplantorProduct } from "../models/products/PaddyTransplantorProduct.model";
import { EarthMoverProduct } from "../models/products/earthMoverProduct.model";
import { AgricultureLaborProduct } from "../models/products/AgricultureLaborProduct.model";
import { DroneProduct } from "../models/products/DroneProduct.model";

export interface IHarvestorProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId | IBusiness;
    images: UploadedImages;
    hp: string;
    modelNo: string;
    type: string;
    verificationStatus: ProductStatus;
    avgRating: number;
    ratings: IRating[];
}

export interface UploadedImages {
    "front-view": string | null;
    "back-view": string | null;
    "left-view": string | null;
    "right-view": string | null;
    "driving-license": string | null;
    "rc-book": string | null;
    "bill": string | null;
    "e-shram-card": string | null;
}

export interface IRating {
    userId: mongoose.Types.ObjectId;
    rating: number;
}

export interface IEarthMoverProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId | IBusiness;
    images: UploadedImages;
    hp: string;
    modelNo: string;
    type: string;
    verificationStatus: ProductStatus;
    avgRating: number;
    ratings: IRating[];
}

export enum ProductStatus {
    VERIFIED = 'Verified',
    UNVERIFIED = 'Unverified',
    REJECTED = 'Rejected',
    RE_VERIFICATION_REQUIRED = 'Reverification Required',
    MODIFICATION_REQUIRED = 'Modification Required',
    BLOCKED = 'Blocked'
}

export type ProductType =
    | IHarvestorProduct
    | IImplementProduct
    | IMachineProduct
    | IMechanicProduct
    | IPaddyTransplantorProduct
    | IAgricultureLaborProduct
    | IEarthMoverProduct
    | IDroneProduct;

export interface IImplementProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId;
    images: UploadedImages;
    hp: string;
    modelNo: string;
    verificationStatus: ProductStatus;
    avgRating: number;
    ratings: IRating[];
}

export interface IMachineProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId | IBusiness;
    images: UploadedImages;
    hp: string;
    modelNo: string;
    verificationStatus: ProductStatus;
    avgRating: number;
    ratings: IRating[];
}

export interface IPaddyTransplantorProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId | IBusiness;
    images: UploadedImages;
    hp: string;
    modelNo: string;
    verificationStatus: ProductStatus;
    avgRating: number;
    ratings: IRating[];
}

export interface IDroneProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId | IBusiness;
    images: UploadedImages;
    modelNo: string;
    type: string;
    verificationStatus: ProductStatus;
    avgRating: number;
    ratings: IRating[];
}

export interface IMechanicProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId | IBusiness;
    images: UploadedImages;
    eShramCardNumber: string;
    readyToTravelIn10Km: boolean;
    isIndividual: boolean;
    services: MechanicServiceType[];
    numberOfWorkers: number;
    verificationStatus: ProductStatus;
    avgRating: number;
    ratings: IRating[];
}

export enum MechanicServiceType {
    ELECTRIC_WATER_PUMP = 'Electric Water Pump',
    DIESEL_WATER_PUMP = 'Diesel Water Pump',
    SOLAR_WATER_PUMP = 'Solar Water Pump',
    TRACTOR_REPAIR = 'Tractor Repair',
}

export enum TechnicianServiceType {
    HYDROPONICS_TECHNICIAN = 'Hydroponics Technician',
    POLYHOUSE_TECHNICIAN = 'Polyhouse Technician',
    DRONE_TECHNICIAN = 'Drone technician',
    VERTICAL_FARM_TECHNICIAN = 'Vertical Farm Technician',
    AGRONOMIST = 'Agronomist',
    PRECISION_IRRIGATION_TECHNICIANS = 'Precision Irrigation Technicians',
}

export interface IAgricultureLaborProduct extends Document {
    _id: mongoose.Types.ObjectId;
    business: mongoose.Types.ObjectId | IBusiness;
    images: UploadedImages;
    eShramCardNumber: string;
    readyToTravelIn10Km: boolean;
    isIndividual: boolean;
    services: AgricultureLaborServiceType[];
    numberOfWorkers: number;
    verificationStatus: ProductStatus;
    avgRating: number;
    ratings: IRating[];
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

