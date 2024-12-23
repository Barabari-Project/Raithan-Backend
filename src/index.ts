import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import winston from 'winston';
import moment from 'moment-timezone';
import connectToDatabase from './database';
import routes from './routes';
dotenv.config();

connectToDatabase();

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_BASE_URL,
}));

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


app.get('/health', (req: Request, res: Response) => {
    res.sendStatus(200);
});
app.use('/api', routes); 

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logger.error(
        `Error occurred during ${req.method} request to ${req.url} | Status: ${err.statusCode || 500} | Message: ${err.message || "No error message"} | Stack: ${err.stack || "No stack trace"}`
    );
    // if statusCode is there it means that message will also be created by us
    // if statusCode is not there it means that message is not created by us its something else in this situation we want to send internal server error.
    res.status(err.statusCode ? err.statusCode : 500).json({ error: err.statusCode ? err.message : 'Internal Server Error.Please try again later.' });
});

app.listen(process.env.PORT || 3002, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3002}`);
});