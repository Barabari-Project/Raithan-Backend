import { AgricultureLaborProduct } from "../models/products/AgricultureLaborProduct.model";
import { DroneProduct } from "../models/products/DroneProduct.model";
import { EarthMoverProduct } from "../models/products/earthMoverProduct.model";
import { HarvestorProduct } from "../models/products/harvestorProduct.model";
import { ImplementProduct } from "../models/products/ImplementProduct.model";
import { MachineProduct } from "../models/products/MachineProduct.model";
import { MechanicProduct } from "../models/products/MechanicProduct.model";
import { PaddyTransplantorProduct } from "../models/products/PaddyTransplantorProduct.model";
import { TechnicianProduct } from "../models/products/TechnicianProduct.model";
import { BusinessCategory } from "../types/business.types";

export const modelMapping: Record<BusinessCategory, any> = {
    [BusinessCategory.HARVESTORS]: HarvestorProduct,
    [BusinessCategory.IMPLEMENTS]: ImplementProduct,
    [BusinessCategory.MACHINES]: MachineProduct,
    [BusinessCategory.MECHANICS]: MechanicProduct,
    [BusinessCategory.PADDY_TRANSPLANTORS]: PaddyTransplantorProduct,
    [BusinessCategory.AGRICULTURE_LABOR]: AgricultureLaborProduct,
    [BusinessCategory.EARTH_MOVERS]: EarthMoverProduct,
    [BusinessCategory.DRONES]: DroneProduct,
    [BusinessCategory.TECHNICIAN]: TechnicianProduct,
};