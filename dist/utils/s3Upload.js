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
exports.getImageUrl = exports.uploadFileToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const __1 = require("..");
const http_errors_1 = __importDefault(require("http-errors"));
// Create an S3 client
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION, // Define region here
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const uploadFileToS3 = (file, folder, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const contentType = file.mimetype;
    if (!allowedMimeTypes.includes(contentType)) {
        throw (0, http_errors_1.default)(400, 'Unsupported file type');
    }
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folder}/${fileName}`, // File name in the bucket
        Body: file.buffer, // File content
        ContentType: file.mimetype, // File type
    };
    const command = new client_s3_1.PutObjectCommand(params);
    // Upload the file using the S3 client
    yield s3.send(command);
    return `${folder}/${fileName}`;
});
exports.uploadFileToS3 = uploadFileToS3;
const getImageUrl = (fileKey) => __awaiter(void 0, void 0, void 0, function* () {
    __1.logger.debug(fileKey);
    // if (!fileKey.includes('/secured')) {
    if (true) {
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }
    else {
        console.log("we are here");
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        };
        const command = new client_s3_1.GetObjectCommand(params);
        console.log("going to make a call");
        const presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 60 * 5 }); // Expires in 5 minutes
        console.log("getting error make a call");
        return presignedUrl;
    }
});
exports.getImageUrl = getImageUrl;
