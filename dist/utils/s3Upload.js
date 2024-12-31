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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageUrl = exports.uploadFileToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const __1 = require("..");
// Create an S3 client
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION, // Define region here
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const uploadFileToS3 = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('from here')
    const fileName = `${(0, uuid_1.v4)()}-${file.originalname}`; // Unique file name
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${folder}/${fileName}`, // File name in the bucket
        Body: file.buffer, // File content
        ContentType: file.mimetype, // File type
    };
    const command = new client_s3_1.PutObjectCommand(params);
    // Upload the file using the S3 client
    yield s3.send(command);
    console.log('uploadFileToS3');
    return `${folder}/${fileName}`;
});
exports.uploadFileToS3 = uploadFileToS3;
const getImageUrl = (fileKey) => __awaiter(void 0, void 0, void 0, function* () {
    __1.logger.debug(fileKey);
    if (!fileKey.includes('/secured')) {
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    }
    else {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
        };
        const command = new client_s3_1.GetObjectCommand(params);
        const presignedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 60 * 5 }); // Expires in 5 minutes
        return presignedUrl;
    }
});
exports.getImageUrl = getImageUrl;
