"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
const http_errors_1 = __importDefault(require("http-errors"));
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw (0, http_errors_1.default)(500, 'MONGO_URI is not defined');
        }
        yield mongoose_1.default.connect(uri, { dbName: process.env.DB || 'Raithan' });
        _1.logger.info('Connected to MongoDB Cloud successfully!');
    }
    catch (error) {
        _1.logger.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with a failure
    }
});
exports.default = connectToDatabase;