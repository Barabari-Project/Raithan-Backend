import { S3Client, PutObjectCommand, GetObjectCommand, PutObjectCommandInput, } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '..';
import createHttpError from 'http-errors';

// Create an S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION, // Define region here
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export const uploadFileToS3 = async (file: Express.Multer.File, folder: string, fileName: string): Promise<string> => {
    console.log('AWS_REGION:', process.env.AWS_REGION);
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
    console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);

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
    logger.debug(fileKey);
    if (!fileKey.includes('/secured')) {
        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
    } else {
        console.log("we are here");
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: fileKey,
        };

        const command = new GetObjectCommand(params);
        console.log("going to make a call");
        const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // Expires in 5 minutes
        console.log("getting error make a call");
        return presignedUrl;
    }
};