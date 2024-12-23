import mongoose from 'mongoose';
import { logger } from '.';
import createHttpError from 'http-errors';

const connectToDatabase = async (): Promise<void> => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            throw createHttpError(500, 'MONGO_URI is not defined');
        }
        await mongoose.connect(uri, { dbName: process.env.DB || 'Raithan' });
        logger.info('Connected to MongoDB Cloud successfully!');
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with a failure
    }
};

export default connectToDatabase;