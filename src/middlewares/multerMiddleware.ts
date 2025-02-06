import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import createHttpError from 'http-errors';
import { logger } from '..';

const storage = multer.memoryStorage();

export const multerMiddleware = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new multer.MulterError('LIMIT_FIELD_VALUE'));
        }
    },
});

// Middleware to handle multer errors
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            throw createHttpError(400, 'File size should not exceed 5 MB');
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            throw createHttpError(400, 'You can only upload up to 6 images');
        } else if (err.code === 'LIMIT_FIELD_VALUE') {
            throw createHttpError(400, 'Only .jpg, .jpeg, and .png file types are allowed');
        }
    }
    next(err); // Pass other errors to the next middleware
};
