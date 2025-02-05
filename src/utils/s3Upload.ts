import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client, } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Create an S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION, // Define region here
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const uploadFileToS3 = async (file: Express.Multer.File, folder: string, fileName: string): Promise<string> => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const contentType = file.mimetype;
    if (!allowedMimeTypes.includes(contentType)) {
        throw createHttpError(400, 'Unsupported file type');
    }
    const params: PutObjectCommandInput = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${folder}/${fileName}`, // File name in the bucket
        Body: file.buffer, // File content
        ContentType: file.mimetype, // File type
    };
    const command = new PutObjectCommand(params);

    // Upload the file using the S3 client
    await s3.send(command);
    return `${folder}/${fileName}`;
};

export const getImageUrl = async (fileKey: string): Promise<string> => {
    if (!fileKey.includes('/secured')) {
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } else {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileKey,
        };

        const command = new GetObjectCommand(params);
        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
        return presignedUrl;
    }
};