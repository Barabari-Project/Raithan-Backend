import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import createHttpError from 'http-errors';

const storage = multer.memoryStorage();

export const multerMiddleware = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
    },
});

// Middleware to handle multer errors
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            throw createHttpError(400, 'File size should not exceed 5 MB');
        }
    }
    next(err); // Pass other errors to the next middleware
};
