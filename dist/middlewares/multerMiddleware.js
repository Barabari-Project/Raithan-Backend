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
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            throw createHttpError(400, 'File size should not exceed 5 MB');
        }
        else if (err.code === 'LIMIT_FILE_COUNT') {
            throw createHttpError(400, 'You can only upload up to 6 images');
        }
    }
    next(err); // Pass other errors to the next middleware
};
