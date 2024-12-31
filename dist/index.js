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
const s3Upload_1 = require("./utils/s3Upload");
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
app.post('/ghi', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = yield (0, s3Upload_1.getImageUrl)(req.body.key);
    res.status(200).json({ url });
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
