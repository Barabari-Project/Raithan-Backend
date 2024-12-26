"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = exports.multerMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const http_errors_1 = __importDefault(require("http-errors"));
const storage = multer_1.default.memoryStorage();
exports.multerMiddleware = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
}).single('profilePicture');
// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            throw (0, http_errors_1.default)(400, 'File size should not exceed 5 MB');
        }
    }
    next(err); // Pass other errors to the next middleware
};
exports.handleMulterError = handleMulterError;
