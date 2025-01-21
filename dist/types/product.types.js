"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgricultureLaborServiceType = exports.MechanicServiceType = exports.ProductStatus = exports.modelMapping = void 0;
const business_types_1 = require("./business.types");
const harvestorProduct_model_1 = require("../models/products/harvestorProduct.model");
const ImplementProduct_model_1 = require("../models/products/ImplementProduct.model");
const MechanicProduct_model_1 = require("../models/products/MechanicProduct.model");
const MachineProduct_model_1 = require("../models/products/MachineProduct.model");
const PaddyTransplantorProduct_model_1 = require("../models/products/PaddyTransplantorProduct.model");
const earthMoverProduct_model_1 = require("../models/products/earthMoverProduct.model");
const AgricultureLaborProduct_model_1 = require("../models/products/AgricultureLaborProduct.model");
const DroneProduct_model_1 = require("../models/products/DroneProduct.model");
exports.modelMapping = {
    [business_types_1.BusinessCategory.HARVESTORS]: harvestorProduct_model_1.HarvestorProduct,
    [business_types_1.BusinessCategory.IMPLEMENTS]: ImplementProduct_model_1.ImplementProduct,
    [business_types_1.BusinessCategory.MACHINES]: MachineProduct_model_1.MachineProduct,
    [business_types_1.BusinessCategory.MECHANICS]: MechanicProduct_model_1.MechanicProduct,
    [business_types_1.BusinessCategory.PADDY_TRANSPLANTORS]: PaddyTransplantorProduct_model_1.PaddyTransplantorProduct,
    [business_types_1.BusinessCategory.AGRICULTURE_LABOR]: AgricultureLaborProduct_model_1.AgricultureLaborProduct,
    [business_types_1.BusinessCategory.EARTH_MOVERS]: earthMoverProduct_model_1.EarthMoverProduct,
    [business_types_1.BusinessCategory.DRONES]: DroneProduct_model_1.DroneProduct,
};
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
