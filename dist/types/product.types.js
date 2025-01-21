"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgricultureLaborServiceType = exports.MechanicServiceType = exports.ProductStatus = void 0;
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["VERIFIED"] = "Verified";
    ProductStatus["UNVERIFIED"] = "Unverified";
    ProductStatus["REJECTED"] = "Rejected";
    ProductStatus["RE_VERIFICATION_REQUIRED"] = "Reverification Required";
    ProductStatus["MODIFICATION_REQUIRED"] = "Modification Required";
    ProductStatus["BLOCKED"] = "Blocked";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
var MechanicServiceType;
(function (MechanicServiceType) {
    MechanicServiceType["ELECTRIC_WATER_PUMP"] = "Electric Water Pump";
    MechanicServiceType["DIESEL_WATER_PUMP"] = "Diesel Water Pump";
    MechanicServiceType["SOLAR_WATER_PUMP"] = "Solar Water Pump";
    MechanicServiceType["TRACTOR_REPAIR"] = "Tractor Repair";
})(MechanicServiceType || (exports.MechanicServiceType = MechanicServiceType = {}));
var AgricultureLaborServiceType;
(function (AgricultureLaborServiceType) {
    AgricultureLaborServiceType["SOWING_DRYLANDS"] = "Sowing Drylands";
    AgricultureLaborServiceType["TRANSPLANTATION_WETLANDS"] = "Transplantation Wetlands";
    AgricultureLaborServiceType["WEEDING_DRYLANDS"] = "Weeding Drylands";
    AgricultureLaborServiceType["WEEDING_WETLANDS"] = "Weeding Wetlands";
    AgricultureLaborServiceType["FERTILIZATION_DRYLANDS"] = "Fertilization Drylands";
    AgricultureLaborServiceType["FERTILIZATION_WETLANDS"] = "Fertilization Wetlands";
    AgricultureLaborServiceType["SPRAYING_DRYLANDS_WITH_HAND_PUMP"] = "Spraying Drylands with Hand pump";
    AgricultureLaborServiceType["SPRAYING_DRYLANDS_WITH_BATTERY_PUMP"] = "Spraying Drylands with Battery pump";
    AgricultureLaborServiceType["SPRAYING_DRYLANDS_WITH_PETROL_PUMP"] = "Spraying Drylands with Petrol pump";
    AgricultureLaborServiceType["SPRAYING_WETLANDS_WITH_HAND_PUMP"] = "Spraying Wetlands with Hand pump";
    AgricultureLaborServiceType["SPRAYING_WETLANDS_WITH_BATTERY_PUMP"] = "Spraying Wetlands with Battery pump";
    AgricultureLaborServiceType["SPRAYING_WETLANDS_WITH_PETROL_PUMP"] = "Spraying Wetlands with Petrol pump";
    AgricultureLaborServiceType["HARVESTING_COMMERCIAL_CROPS"] = "Harvesting Commercial Crops";
    AgricultureLaborServiceType["HARVESTING_FRUITS_CROPS"] = "Harvesting Fruits Crops";
    AgricultureLaborServiceType["HARVESTING_VEGETABLES_CROPS"] = "Harvesting Vegetables Crops";
    AgricultureLaborServiceType["HARVESTING_CROPS"] = "Harvesting Crops";
})(AgricultureLaborServiceType || (exports.AgricultureLaborServiceType = AgricultureLaborServiceType = {}));
