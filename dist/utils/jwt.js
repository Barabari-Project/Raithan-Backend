"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.generateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJwt = (payload, secret, expiresIn = "365d") => {
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateJwt = generateJwt;
const verifyJwt = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyJwt = verifyJwt;
