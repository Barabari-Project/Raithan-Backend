import { verifyJwt } from "../utils/jwt";
import createHttpError from "http-errors";
import expressAsyncHandler from "express-async-handler";
export const authMiddleware = (secret) => expressAsyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        throw createHttpError(401, "Unauthorized");
    }
    try {
        const decoded = verifyJwt(token, secret);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        throw createHttpError(401, "Invalid token");
    }
});
