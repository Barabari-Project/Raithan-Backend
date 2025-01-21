"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelMapping = void 0;
const AgricultureLaborProduct_model_1 = require("../models/products/AgricultureLaborProduct.model");
const DroneProduct_model_1 = require("../models/products/DroneProduct.model");
const earthMoverProduct_model_1 = require("../models/products/earthMoverProduct.model");
const harvestorProduct_model_1 = require("../models/products/harvestorProduct.model");
const ImplementProduct_model_1 = require("../models/products/ImplementProduct.model");
const MachineProduct_model_1 = require("../models/products/MachineProduct.model");
const MechanicProduct_model_1 = require("../models/products/MechanicProduct.model");
const PaddyTransplantorProduct_model_1 = require("../models/products/PaddyTransplantorProduct.model");
const business_types_1 = require("../types/business.types");
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
