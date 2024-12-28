import multer from "multer";

const storage = multer.memoryStorage();

// export const multerMiddleware = multer({
//     storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024, // 5 MB per file
//     },
// }).array('images', 6);

export const multerMiddlewareForSingleFile = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB per file
    },
});