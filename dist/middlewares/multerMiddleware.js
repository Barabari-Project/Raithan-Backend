"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = exports.multerMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const http_errors_1 = __importDefault(require("http-errors"));
const __1 = require("..");
const storage = multer_1.default.memoryStorage();
exports.multerMiddleware = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        }
        else {
            cb(new multer_1.default.MulterError('LIMIT_FIELD_VALUE'));
        }
    },
});
// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
    __1.logger.debug(err);
    __1.logger.debug(err.code);
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            throw (0, http_errors_1.default)(400, 'File size should not exceed 5 MB');
        }
        else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            throw (0, http_errors_1.default)(400, 'You can only upload up to 6 images');
        }
        else if (err.code === 'LIMIT_FIELD_VALUE') {
            throw (0, http_errors_1.default)(400, 'Only .jpg, .jpeg, and .png file types are allowed');
        }
    }
    next(err); // Pass other errors to the next middleware
};
exports.handleMulterError = handleMulterError;
