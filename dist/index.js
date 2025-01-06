"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const path_1 = __importDefault(require("path"));
const winston_1 = __importDefault(require("winston"));
const database_js_1 = __importDefault(require("./database.js"));
const routes_1 = __importDefault(require("./routes"));
const validateEnvVars_1 = require("./utils/validateEnvVars");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
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
(0, validateEnvVars_1.validateEnvVars)();
(0, database_js_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*',
}));
app.get('/raithan/health', (req, res) => {
    res.sendStatus(200);
});
app.use('/raithan/api', routes_1.default);
app.use((err, req, res, next) => {
    exports.logger.error(`Error occurred during ${req.method} request to ${req.url} | Status: ${err.statusCode || 500} | Message: ${err.message || "No error message"} | Stack: ${err.stack || "No stack trace"}`);
    // if statusCode is there it means that message will also be created by us
    // if statusCode is not there it means that message is not created by us its something else in this situation we want to send internal server error.
    res.status(err.statusCode ? err.statusCode : 500).json({ error: err.statusCode ? err.message : 'Internal Server Error.Please try again later.' });
});
app.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3002, () => {
    var _a;
    exports.logger.info(`Server is running on http://localhost:${(_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3002}`);
});
