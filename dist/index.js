"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const winston_1 = __importDefault(require("winston"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const database_1 = __importDefault(require("./database"));
const routes_1 = __importDefault(require("./routes"));
const multer_1 = __importDefault(require("multer"));
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
}));
exports.logger = winston_1.default.createLogger({
    // Log only if level is less than (meaning more severe) or equal to this
    level: "debug",
    // Use timestamp and printf to create a standard log format
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: () => (0, moment_timezone_1.default)().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    }), winston_1.default.format.printf((data) => `${data.timestamp} ${data.level}: ${data.message}`)),
    // Log to the console and a file
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: `${process.env.LOG_FILE_PATH || 'logs/app.log'}` }),
    ],
});
app.get('/raithan/health', (req, res) => {
    res.sendStatus(200);
});
app.use('/raithan/api', routes_1.default);
app.use((err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            exports.logger.error(`Error occurred during ${req.method} request to ${req.url} | Status: ${400} | Message: 'File size should not exceed 5 MB' || "No error message"} | Stack: ${err.stack || "No stack trace"}`);
            res.status(400).json({ error: 'File size should not exceed 5 MB' });
            return;
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            exports.logger.error(`Error occurred during ${req.method} request to ${req.url} | Status: ${400} | Message: 'You can only upload up to 6 images' || "No error message"} | Stack: ${err.stack || "No stack trace"}`);
            res.status(400).json({ error: 'You can only upload up to 6 images' });
            return;
        }
    }
    exports.logger.error(`Error occurred during ${req.method} request to ${req.url} | Status: ${err.statusCode || 500} | Message: ${err.message || "No error message"} | Stack: ${err.stack || "No stack trace"}`);
    // if statusCode is there it means that message will also be created by us
    // if statusCode is not there it means that message is not created by us its something else in this situation we want to send internal server error.
    res.status(err.statusCode ? err.statusCode : 500).json({ error: err.statusCode ? err.message : 'Internal Server Error.Please try again later.' });
});
app.listen(process.env.PORT || 3002, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3002}`);
});
