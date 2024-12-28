import { logger } from "..";

const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'DB',
    'LOG_FILE_PATH',
    'ACCOUNT_SID',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_VERIFY_SERVICE_SID',
    'JWT_SECRET',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_BUCKET_NAME',
    'ADMIN_ID',
    'EMAIL',
    'PASSWORD',
    'ADMIN_JWT_SECRET',
    'PROVIDER_JWT_SECRET',
    'SEEKER_JWT_SECRET',
];

export function validateEnvVars() {
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
        const errorMessage = `Missing environment variables: ${missingVars.join(', ')}`;
        logger.error(errorMessage); // Log the error
        process.exit(1);
    }
}