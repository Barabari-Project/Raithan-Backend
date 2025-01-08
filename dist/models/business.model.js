"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Business = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const business_types_1 = require("../types/business.types");
const http_errors_1 = __importDefault(require("http-errors"));
const __1 = require("..");
const BusinessSchema = new mongoose_1.Schema({
    businessName: {
        type: String,
        required: [true, "Business Name is required"],
        trim: true,
    },
    pincode: {
        type: String,
        required: [true, "Pincode is required"],
        validate: {
            validator: (v) => /^\d{6}$/.test(v),
            message: (props) => `${props.value} is not a valid pincode!`,
        },
    },
    blockNumber: {
        type: String,
        required: [true, "block Number is required"],
    },
    street: {
        type: String,
        required: [true, "Street is required"],
    },
    area: {
        type: String,
        required: [true, "area is required"],
    },
    landmark: {
        type: String,
    },
    city: {
        type: String,
        required: [true, "city is required"],
    },
    state: {
        type: String,
        required: [true, "state is required"],
    },
    serviceProvider: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'serviceProvider',
        required: [true, 'serviceProvider is required'],
    },
    workingDays: {
        type: Map,
        of: Boolean,
        required: [true, "workingDays are required"],
        default: {
            Monday: false,
            Tuesday: false,
            Wednesday: false,
            Thursday: false,
            Friday: false,
            Saturday: false,
            Sunday: false,
        },
    },
    workingTime: {
        type: new mongoose_1.Schema({
            start: {
                type: String,
                required: true,
                validate: {
                    validator: (v) => /^([0]?[0-9]|1[0-2]):[0-5][0-9] [ap]m$/.test(v),
                    message: (props) => `${props.value} is not a valid time!`,
                },
            },
            end: {
                type: String,
                required: true,
                validate: {
                    validator: (v) => /^([0]?[0-9]|1[0-2]):[0-5][0-9] [AP]M$/.test(v),
                    message: (props) => `${props.value} is not a valid time!`,
                },
            },
        }, { _id: false }),
        required: [true, "working time is required"],
    },
    category: {
        type: [String],
        default: [],
        enum: Object.values(business_types_1.BusinessCategory),
    },
}, { timestamps: true });
BusinessSchema.post('save', function (error, doc, next) {
    __1.logger.debug(error.name);
    if (error.name === 'ValidationError') {
        const firstError = error.errors[Object.keys(error.errors)[0]];
        throw (0, http_errors_1.default)(400, firstError.message);
    }
    else if (error.name == 'MongooseError') {
        throw (0, http_errors_1.default)(400, `${error.message}`);
    }
    else {
        next(error); // Pass any other errors to the next middleware
    }
});
// Export the model
exports.Business = mongoose_1.default.model('business', BusinessSchema, 'business');
