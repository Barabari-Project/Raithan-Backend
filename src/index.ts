import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import moment from 'moment-timezone';
import path from 'path';
import winston from 'winston';
import connectToDatabase from './database.js';
import routes from './routes';
import { getImageUrl } from './utils/s3Upload';
import { validateEnvVars } from './utils/validateEnvVars';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const logger = winston.createLogger({
    // Log only if level is less than (meaning more severe) or equal to this
    level: "debug",
    // Use timestamp and printf to create a standard log format
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        }),
        winston.format.printf(
            (data) => `${data.timestamp} ${data.level}: ${data.message}`
        )
    ),
    // Log to the console and a file
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `${process.env.LOG_FILE_PATH || 'logs/app.log'}` }),
    ],
});

validateEnvVars();
connectToDatabase();

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
}));

app.post('/ghi', async (req: Request, res: Response) => {
    const url = await getImageUrl(req.body.key);
    res.status(200).json({ url });
})

app.get('/raithan/health', (req: Request, res: Response) => {
    res.sendStatus(200);
});
app.use('/raithan/api', routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(
        `Error occurred during ${req.method} request to ${req.url} | Status: ${err.statusCode || 500} | Message: ${err.message || "No error message"} | Stack: ${err.stack || "No stack trace"}`
    );

    // if statusCode is there it means that message will also be created by us
    // if statusCode is not there it means that message is not created by us its something else in this situation we want to send internal server error.
    res.status(err.statusCode ? err.statusCode : 500).json({ error: err.statusCode ? err.message : 'Internal Server Error.Please try again later.' });
});

app.listen(process.env.PORT ?? 3002, () => {
    logger.info(`Server is running on http://localhost:${process.env.PORT ?? 3002}`);
});